### 新建  
```  
git init project-name 新建项目  
git clone url   
```  
  
### 配置  
```  
git config --list   
```  
  
### 添加文件到暂存区  
```  
git add file1 file2  
git add dir  
git add .   添加所有工作区的文件到暂存区  
git add -A  添加所有文件到暂存区，包括工作区和Unmerged区（冲突）的  
```  
  
### reset 修改HEAD指向  
```  
git reset --hard head~5         回退到head~5版本，清空暂存区并删除工作区文件  
git reset --soft head~5         回退到head~5版本，不删除工作区文件，不请空暂存区，将两个版本之间的修改放入暂存区  
git reset head~5 (--mixed)       回退到head~5版本，将目前暂存区全部移动到工作去区且不删除工作区已有的文件。最后将两个版本之间的修改也放入工作区  
git reset head dir/files			回退指定文件  
```  
  
### 撤销并保存撤销记录  
```  
git revert head~5 用head~5的版本覆盖本地版本（不会丢失记录，而reset会丢失掉被reseted的分支记录）  
```  
  
### 撤销未暂存的文件  
```  
git checkout files   
git checkout . 撤销所有未暂存的更改（并不能移除新文件（即没有被追踪的文件），需要使用git clean 命令）  
git checkout branch 切换分支  
```  
  
### 移除未追踪的文件（新文件）  
```  
git clean -f 移除未追踪的文件  
git clean -fd 移除未追踪的文件和文件夹  
git clean -nfd 移除并查看将被移除的记录  
```  
  
### 将暂存区的文件提交到本地仓库  
```  
git commit -m message  
git commit file1 file2 -m message  
git commit --amend files -m message 添加到上次的commit  
```  
  
### 分支  
```  
git branch 查看本地分支  
git branch -r 查看远程分支  
git branch -a 查询看本地和远程分支  
git checkout branch 切换分支  
git checkout -b branch 新建并切换到该分支  
git checkout - 切换到上一个分支  
git branch --track branch remote-branch 新建分支并追踪  
git branch --set-upstream-to=origin/branch branch  建立追踪信息  
git branch -d branch 删除分支  
git branch -dr origin/branch 删除本地的远程分支  
```  
  
### 信息  
```  
git status 查看变更的文件和当前分支  
git log --stat 显示commit历史及每次commit变更的文件  
git log -p files 查看指定文件的每一次diff  
git log --graph 树状图显示合并记录  
git log --format="%an %ai %s %h" 分别显示每次提交的作者、时间、comment、短hash  
git log -n n为大于1的数字，表示显示n条记录  
git diff 查看工作区与当前HEAD的区别，git diff commit 查看工作区与commit分支的区别，git diff commit1 commit2,比较两个分支的区别  
git diff --cached 查看暂存区与当前HEAD的区别  
```  
  
### 远程同步  
```  
git fetch 下载远程仓库的所有变动  
git pull 拉取远程分支并合并  
git push 提交到远程分  
git push origin/branch --force 强行推送即使有冲突  
git push --set-upstream origin branch 将当前分支推送到远程并建立追踪  
```  
  
### 远程仓库  
```  
git remote rm origin 删除远程仓库  
git remote add origin url 新增远程仓库  
git remote show origin 查看远程分支和“本地的远程分支”的区别  
git remote prune origin 删除“本地的远程分支”存在而真正的远程已经被删除的分支  
```  
  
### 其他  
```  
git stash push -u # 将未提交的文件保存，-u表示保存Untracked的文件  
git stash list   
git stash pop 将stash保存的最新文件恢复，并从list中删除  
git stash apply 1 将stash@{1}保存的文件恢复，但不删除  
git stash drop 1 将stash@{1}保存的文件删除  
git stash show 1 查看stash@{1}中修改的文件  
git stash show -p 1 查看stash@{1}中修改的文件详情  
```  
  
### 强制操作  
```  
git reset --hard origin/branch 强制覆盖本地分支（把HEAD指向远程分支）  
git push origin branch --force 强制覆盖远程分支  
```  
  
### git rebase   
```bash  
#功能1：合并多个commit成一个  
    git rebase -i head~3 # -i 进入选择模式(如果意外退出编辑模式，使用git rebase --edit-todo再次进入)  
    # p, pick <commit> = use commit 保留这个commit  
    # r, reword <commit> = use commit, but edit the commit message 修改这个commit的message  
    # s, squash <commit> = use commit, but meld into previous commit 将这个commit和前面一个commit合并，所以这个分支之前至少要有一个选择pick模式  
  
#功能2：变基  
    可以实现合并的效果，但是不保留分支信息  
      
http://jartto.wang/2018/12/11/git-rebase/  
git rebase 是一个危险命令，因为它改变了历史，我们应该谨慎使用。  
除非你可以肯定该分支只有你自己使用，否则请谨慎操作。  
```  
### git cherry-pick  
```  
    git cherry-pick <commitHash> #将commitHash应用于当前分支  
    git cherry-pick commitA commitB #将commitA和commitB的修改应用于当前分支  
    git cherry-pick commitA..commitB #将commitA到commitB的修改应用于当前分支  
    -n # 只更新工作区和暂存区，不产生新的提交。  
    git cherry-pick --continue # 用户解决代码冲突后先git add .然后执行这条命令  
    git cherry-pick --abort # 发生代码冲突后，放弃合并，回到操作前的样子  
    git cherry-pick --quit # 发生代码冲突后，退出 Cherry pick，但是不回到操作前的样子  
```  
### 换行符  
```  
#提交时转换为LF，检出时转换为CRLF  
git config --global core.autocrlf true  
#提交时转换为LF，检出时不转换  
git config --global core.autocrlf input  
#提交检出均不转换  
git config --global core.autocrlf false  
#拒绝提交包含混合换行符的文件  
git config --global core.safecrlf true     
# 允许提交包含混合换行符的文件  
git config --global core.safecrlf false     
# 提交包含混合换行符的文件时给出警告  
git config --global core.safecrlf warn  
# 设置成大小写敏感  
git config --global core.ignorecase false  
```  
  
### 查找commit  
```  
git log --graph --all // 查看所有分支和所有commit  
git fsck --lost-found | grep commit | awk '{print $3}' | xargs -n1 -I ? git log  -n 1 ? // 查找没有分支的commit  
git reflog // 查看commit日志  
```  