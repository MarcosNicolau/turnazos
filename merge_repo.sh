cd ../back_end/$1
git filter-repo --to-subdirectory-filter $1

cd ../../migration
cd $1
git remote add $1 ../back_end/$1 
git fetch $1 
git merge --allow-unrelated-histories $1/staging # or whichever branch you want to merge
git remote remove $1