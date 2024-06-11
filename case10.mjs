import { GithubRepoLoader } from "langchain/document_loaders/web/github";

const loader = new GithubRepoLoader(
    "https://github.com/RealKai42/qwerty-learner",
    { 
        branch: "master", // 分支
        recursive: false, // 是否递归
        unknown: "warn", 
        ignorePaths: ["*.md", "yarn.lock", "*.json"],
        // accessToken: env["GITHUB_TOKEN"]
    }
);

console.log(await loader.load());