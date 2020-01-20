locals {
  function_name = "binHelper"
}

resource "aws_lambda_function" "function" {
  filename                       = "${path.module}/dummy.zip"
  function_name                  = local.function_name
  handler                        = "index.handler"
  role                           = aws_iam_role.role.arn
  runtime                        = "nodejs12.x"

  lifecycle {
    ignore_changes = [
      "filename",
      "last_modified",
      "layers",
      "runtime",
      "timeout",
    ]
  }
  depends_on = [aws_iam_role_policy_attachment.policy, aws_iam_policy.policy]
}

resource "aws_cloudwatch_log_group" "logs" {
  name = "/aws/lambda/${local.function_name}"
}

data "aws_iam_policy_document" "role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "role" {
  assume_role_policy = data.aws_iam_policy_document.role.json
  name               = local.function_name
}

data "aws_iam_policy_document" "policy" {
  statement {
    sid = "storeLogs"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "${aws_cloudwatch_log_group.logs.arn}/*",
    ]
  }
  statement {
    sid = "getDataFromS3"
    actions = [
      "s3:GetObject"
    ]

    resources = [
      "arn:aws:s3:::bincollectiondata/*",
    ]
  }
}

resource "aws_iam_policy" "policy" {
  description = "IAM policy for the lambda function: ${local.function_name}"
  name        = local.function_name
  policy      = data.aws_iam_policy_document.policy.json
}

resource "aws_iam_role_policy_attachment" "policy" {
  role       = aws_iam_role.role.name
  policy_arn = aws_iam_policy.policy.arn
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id       = "AllowExecutionFromAlexa"
  action             = "lambda:InvokeFunction"
  event_source_token = "amzn1.ask.skill.491b1bc1-1321-48aa-86a8-0b1a0b8d37ff"
  function_name      = local.function_name
  principal          = "alexa-appkit.amazon.com"
}