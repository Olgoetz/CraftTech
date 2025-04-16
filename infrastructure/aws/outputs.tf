output "s3_bucket_user" {
  value       = aws_iam_user.s3_bucket_user.name
  description = "Name of the S3 bucket user"
}

output "s3_bucket_arn" {
  value       = module.s3_bucket.s3_bucket_arn
  description = "The ARN of the S3 bucket"
}

output "s3_bucket_user_parameter" {
  value       = aws_ssm_parameter.s3_bucket_user.name
  description = "The name of the SSM parameter containing the S3 bucket user's access key and secret key"
}
