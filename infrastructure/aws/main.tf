

locals {
  project_name = "CraftTech"
  account_id   = data.aws_caller_identity.current.account_id
  environment  = "nonprod"
}



##### S3 #####

provider "aws" {
  default_tags {
    tags = {
      Name = local.project_name
    }
  }
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

module "s3_bucket" {
  source                   = "terraform-aws-modules/s3-bucket/aws"
  bucket                   = "${lower(local.project_name)}-members-${local.account_id}"
  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"
}

resource "aws_iam_user" "s3_bucket_user" {
  name = "s3_bucket_user"
}

resource "aws_iam_access_key" "s3_bucket_user" {
  user = aws_iam_user.s3_bucket_user.name
}

resource "aws_iam_user_policy" "s3_bucket_user" {
  name = "allow-s3"
  user = aws_iam_user.s3_bucket_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # {
      #   Effect   = "Allow"
      #   Action   = [
      #     "s3:ListBucket",
      #     "s3:GetBucketLocation",
      #   ]
      #   Resource = [
      #     module.s3_bucket.s3_bucket_arn,
      #   ]
      # },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
        ]
        Resource = [
          "${module.s3_bucket.s3_bucket_arn}/*",
        ]
      },
    ]
  })
}

resource "aws_ssm_parameter" "s3_bucket_user" {
  name = "/${local.project_name}/${local.environment}/s3_bucket_user"
  type = "SecureString"
  value = jsonencode({
    access_key = aws_iam_access_key.s3_bucket_user.id,
    secret_key = aws_iam_access_key.s3_bucket_user.secret,
  })
}

output "bucket_name" {
  value = module.s3_bucket.s3_bucket_id

}
