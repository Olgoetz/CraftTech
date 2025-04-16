
# Configure the GitHub Provider
provider "github" {}


locals {
  project_name = "CraftTech"
}



##### GITHUB #####

resource "github_repository" "crafttech" {
  name        = local.project_name
  description = "Codebase for ${local.project_name}"
  visibility  = "public"
  auto_init   = true
}

resource "github_branch" "prod" {
  repository = github_repository.crafttech.name
  branch     = "prod"
}


##### VERCEL #####

resource "vercel_project" "crafttech" {
  name                       = lower(local.project_name)
  framework                  = "nextjs"
  serverless_function_region = "fra1"
  git_repository = {
    type              = "github"
    repo              = github_repository.crafttech.full_name
    production_branch = "prod"

  }
  vercel_authentication = {
    deployment_type = "none"
  }
  build_command   = "npx drizzle-kit generate && npx drizzle-kit migrate && next build"
  install_command = "npm install --legacy-peer-deps"

}
