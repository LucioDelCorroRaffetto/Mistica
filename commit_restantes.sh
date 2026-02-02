#!/bin/bash

# Function to generate commit message based on file path and status
generate_commit_message() {
    local status=$1
    local file=$2
    local basename=$(basename "$file")
    
    if [[ $status == *"D"* ]]; then
        echo "chore: Delete temporary script $basename"
        return
    fi
    
    if [[ $file == *"migrations/"* ]]; then
        echo "feat: Add database migration $basename"
    elif [[ $file == *"utils/"* ]]; then
        echo "feat: Add utility function $basename"
    elif [[ $file == *"assets/avatars/"* ]]; then
        echo "feat: Add user avatar $basename"
    elif [[ $file == *"assets/banners/"* ]]; then
        echo "feat: Add banner image $basename"
    elif [[ $file == *"assets/categories/"* ]]; then
        echo "feat: Add category image $basename"
    elif [[ $file == *"assets/products/"* ]]; then
        echo "feat: Add product image $basename"
    elif [[ $file == *"styles/"* ]]; then
        echo "style: Add stylesheet $basename"
    else
        echo "feat: Add $basename"
    fi
}

# 1. Commit the deletion of the script if it was tracked (it shows as D)
if git status --porcelain | grep "^ D commit_individual.sh" > /dev/null; then
    echo "Processing deletion: commit_individual.sh"
    git rm "commit_individual.sh"
    git commit -m "chore: Delete temporary script commit_individual.sh"
fi

# 2. Process all files in the untracked directories
# We'll use git ls-files --others --exclude-standard to list all untracked files
git ls-files --others --exclude-standard | tr -d '\r' | while IFS= read -r file; do
    message=$(generate_commit_message "??" "$file")
    echo "Processing: $file"
    git add "$file"
    git commit -m "$message"
done

echo "✅ Finished committing all remaining files."
