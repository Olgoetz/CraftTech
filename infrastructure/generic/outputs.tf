output "repo_url" {
  value       = github_repository.crafttech.git_clone_url
  description = "Git Clone URL"
}
