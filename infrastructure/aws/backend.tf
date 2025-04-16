terraform {
  cloud {

    organization = "JJ-GmbH"

    workspaces {
      name = "aws-infra"
    }
  }
}
