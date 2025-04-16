terraform {
  cloud {

    organization = "JJ-GmbH"

    workspaces {
      name = "generic-resources"
    }
  }
}
