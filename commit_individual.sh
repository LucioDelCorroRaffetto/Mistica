#!/bin/bash

# Function to generate commit message based on file path and status
generate_commit_message() {
    local status=$1
    local file=$2
    local basename=$(basename "$file")
    local dirname=$(dirname "$file")
    
    # Handle deletions
    if [[ $status == *"D"* ]]; then
        if [[ $file == *"chango"* ]]; then
            echo "refactor: Remove deprecated chango (shopping cart) implementation"
        else
            echo "refactor: Remove $basename"
        fi
        return
    fi
    
    # Handle new files
    if [[ $status == "??" ]]; then
        # Backend controllers
        if [[ $file == *"controllers/cart-controller.ts" ]]; then
            echo "feat: Add shopping cart controller with CRUD operations"
        elif [[ $file == *"controllers/orders-controller.ts" ]]; then
            echo "feat: Add orders controller for order management"
        elif [[ $file == *"controllers/coupons-controller.ts" ]]; then
            echo "feat: Add coupons controller for discount management"
        elif [[ $file == *"controllers/wishlist-controller.ts" ]]; then
            echo "feat: Add wishlist controller for user wishlist management"
        elif [[ $file == *"controllers/reviews-controller.ts" ]]; then
            echo "feat: Add reviews controller for product reviews"
        elif [[ $file == *"controllers/rewards-controller.ts" ]]; then
            echo "feat: Add rewards controller for loyalty program"
        elif [[ $file == *"controllers/notifications-controller.ts" ]]; then
            echo "feat: Add notifications controller for user notifications"
        elif [[ $file == *"controllers/reading-lists-controller.ts" ]]; then
            echo "feat: Add reading lists controller for personalized book collections"
        
        # Backend services
        elif [[ $file == *"services/cart-service.ts" ]]; then
            echo "feat: Add cart service with business logic"
        elif [[ $file == *"services/orders-service.ts" ]]; then
            echo "feat: Add orders service for order processing"
        elif [[ $file == *"services/stripe-payment-service.ts" ]]; then
            echo "feat: Add Stripe payment integration service"
        elif [[ $file == *"services/notification-service.ts" ]]; then
            echo "feat: Add notification service for user alerts"
        elif [[ $file == *"services/ai-recommendation-service.ts" ]]; then
            echo "feat: Add AI recommendation service for personalized suggestions"
        
        # Backend repositories
        elif [[ $file == *"data/cart-repository.ts" ]]; then
            echo "feat: Add cart repository for database operations"
        elif [[ $file == *"data/product-repository-postgres.ts" ]]; then
            echo "feat: Add PostgreSQL product repository implementation"
        elif [[ $file == *"data/user-repository-postgres.ts" ]]; then
            echo "feat: Add PostgreSQL user repository implementation"
        
        # Backend database
        elif [[ $file == *"database/postgres.ts" ]]; then
            echo "feat: Add PostgreSQL database configuration and connection"
        elif [[ $file == *"database/cart-db.ts" ]]; then
            echo "feat: Add cart database schema and queries"
        elif [[ $file == *"database/orders-db.ts" ]]; then
            echo "feat: Add orders database schema and queries"
        elif [[ $file == *"database/coupons-db.ts" ]]; then
            echo "feat: Add coupons database schema and queries"
        elif [[ $file == *"database/wishlist-db.ts" ]]; then
            echo "feat: Add wishlist database schema and queries"
        elif [[ $file == *"database/reviews-db.ts" ]]; then
            echo "feat: Add reviews database schema and queries"
        elif [[ $file == *"database/rewards-db.ts" ]]; then
            echo "feat: Add rewards database schema and queries"
        elif [[ $file == *"database/notifications-db.ts" ]]; then
            echo "feat: Add notifications database schema and queries"
        elif [[ $file == *"database/reading-list-db.ts" ]]; then
            echo "feat: Add reading lists database schema and queries"
        elif [[ $file == *"database/seed.ts" ]]; then
            echo "feat: Add database seed script for initial data"
        elif [[ $file == *"migrations/"* ]]; then
            echo "feat: Add database migration for schema versioning"
        
        # Backend routes
        elif [[ $file == *"routes/cart-routes.ts" ]]; then
            echo "feat: Add cart API routes"
        elif [[ $file == *"routes/payment-routes.ts" ]]; then
            echo "feat: Add payment API routes"
        elif [[ $file == *"routes/filter-routes.ts" ]]; then
            echo "feat: Add filter API routes for product search"
        elif [[ $file == *"routes/recommendation-routes.ts" ]]; then
            echo "feat: Add recommendation API routes"
        
        # Backend utilities
        elif [[ $file == *"utils/"* ]]; then
            echo "feat: Add utility helper function"
        elif [[ $file == *"server.ts" ]]; then
            echo "feat: Add Express server configuration"
        elif [[ $file == *".env.example" ]]; then
            echo "docs: Add environment variables template"
        
        # Frontend components
        elif [[ $file == *"components/FilterPanel"* ]]; then
            echo "feat: Add filter panel component for product filtering"
        elif [[ $file == *"components/Breadcrumb"* ]]; then
            echo "feat: Add breadcrumb navigation component"
        elif [[ $file == *"components/CouponInput"* ]]; then
            echo "feat: Add coupon input component for checkout"
        elif [[ $file == *"components/ImageGallery"* ]]; then
            echo "feat: Add image gallery component for product images"
        elif [[ $file == *"components/Modal"* ]]; then
            echo "feat: Add reusable modal component"
        elif [[ $file == *"components/NotificationCenter"* ]]; then
            echo "feat: Add notification center component"
        elif [[ $file == *"components/Pagination"* ]]; then
            echo "feat: Add pagination component for product lists"
        elif [[ $file == *"components/PaymentForm"* ]]; then
            echo "feat: Add payment form component with Stripe integration"
        elif [[ $file == *"components/Popover"* ]]; then
            echo "feat: Add popover component for contextual menus"
        elif [[ $file == *"components/ProductComparator"* ]]; then
            echo "feat: Add product comparator component"
        elif [[ $file == *"components/ReviewCard"* ]]; then
            echo "feat: Add review card component for product reviews"
        elif [[ $file == *"components/RewardsPanel"* ]]; then
            echo "feat: Add rewards panel component for loyalty program"
        elif [[ $file == *"components/Table"* ]]; then
            echo "feat: Add reusable table component"
        elif [[ $file == *"components/ThemeToggle"* ]]; then
            echo "feat: Add theme toggle component for dark/light mode"
        elif [[ $file == *"components/Tooltip"* ]]; then
            echo "feat: Add tooltip component"
        elif [[ $file == *"components/WishlistButton"* ]]; then
            echo "feat: Add wishlist button component"
        elif [[ $file == *"components/Form.tsx" ]]; then
            echo "feat: Add reusable form component"
        elif [[ $file == *"components/FormInput.tsx" ]]; then
            echo "feat: Add form input component with validation"
        
        # Frontend pages
        elif [[ $file == *"page/CartPage.tsx" ]]; then
            echo "feat: Add shopping cart page"
        elif [[ $file == *"page/HeroPage.tsx" ]]; then
            echo "feat: Add hero landing page"
        elif [[ $file == *"page/OrdersHistoryPage"* ]]; then
            echo "feat: Add orders history page for user order tracking"
        elif [[ $file == *"page/ProfilePage.tsx" ]]; then
            echo "feat: Add user profile page"
        elif [[ $file == *"page/WishlistPage"* ]]; then
            echo "feat: Add wishlist page for saved items"
        elif [[ $file == *"page/EXAMPLE_CheckoutPage.tsx" ]]; then
            echo "feat: Add checkout page example"
        elif [[ $file == *"page/EXAMPLE_ProductListPageWithFilters.tsx" ]]; then
            echo "feat: Add product list page with filters example"
        
        # Frontend hooks
        elif [[ $file == *"hook/useFormValidation"* ]]; then
            echo "feat: Add form validation custom hook"
        elif [[ $file == *"hook/useNotifications.ts" ]]; then
            echo "feat: Add notifications custom hook"
        
        # Frontend context
        elif [[ $file == *"context/ThemeContext.tsx" ]]; then
            echo "feat: Add theme context for dark/light mode"
        
        # Frontend services
        elif [[ $file == *"services/cart-service.ts" ]]; then
            echo "feat: Add cart service for API integration"
        
        # Frontend assets
        elif [[ $file == *"assets/mistica-logo.svg" ]]; then
            echo "feat: Add Mistica brand logo"
        elif [[ $file == *"assets/avatars/"* ]]; then
            echo "feat: Add user avatar asset"
        elif [[ $file == *"assets/banners/"* ]]; then
            echo "feat: Add banner image asset"
        elif [[ $file == *"assets/categories/"* ]]; then
            echo "feat: Add category image asset"
        elif [[ $file == *"assets/products/"* ]]; then
            echo "feat: Add product image asset"
        
        # Frontend styles
        elif [[ $file == *"styles/"* ]]; then
            echo "feat: Add global styles"
        
        # Frontend types
        elif [[ $file == *"types/cart.ts" ]]; then
            echo "feat: Add cart TypeScript types"
        
        # Domain entities
        elif [[ $file == *"entities/ShoppingCart.ts" ]]; then
            echo "feat: Add ShoppingCart domain entity"
        elif [[ $file == *"entities/Order.ts" ]]; then
            echo "feat: Add Order domain entity"
        elif [[ $file == *"entities/Coupon.ts" ]]; then
            echo "feat: Add Coupon domain entity"
        elif [[ $file == *"entities/Wishlist.ts" ]]; then
            echo "feat: Add Wishlist domain entity"
        elif [[ $file == *"entities/Review.ts" ]]; then
            echo "feat: Add Review domain entity"
        elif [[ $file == *"entities/UserRewards.ts" ]]; then
            echo "feat: Add UserRewards domain entity"
        elif [[ $file == *"entities/Notification.ts" ]]; then
            echo "feat: Add Notification domain entity"
        elif [[ $file == *"entities/ReadingList.ts" ]]; then
            echo "feat: Add ReadingList domain entity"
        
        # Domain use cases
        elif [[ $file == *"use-cases/add-to-cart.ts" ]]; then
            echo "feat: Add cart item use case"
        elif [[ $file == *"use-cases/remove-from-cart.ts" ]]; then
            echo "feat: Remove cart item use case"
        elif [[ $file == *"use-cases/clear-cart.ts" ]]; then
            echo "feat: Clear cart use case"
        elif [[ $file == *"use-cases/get-cart.ts" ]]; then
            echo "feat: Get cart use case"
        elif [[ $file == *"use-cases/delete-cart.ts" ]]; then
            echo "feat: Delete cart use case"
        elif [[ $file == *"use-cases/apply-coupon.ts" ]]; then
            echo "feat: Apply coupon use case"
        elif [[ $file == *"use-cases/manage-orders.ts" ]]; then
            echo "feat: Manage orders use case"
        elif [[ $file == *"use-cases/manage-wishlist.ts" ]]; then
            echo "feat: Manage wishlist use case"
        elif [[ $file == *"use-cases/review-product.ts" ]]; then
            echo "feat: Product review use case"
        elif [[ $file == *"use-cases/manage-rewards.ts" ]]; then
            echo "feat: Manage rewards use case"
        elif [[ $file == *"use-cases/manage-notifications.ts" ]]; then
            echo "feat: Manage notifications use case"
        elif [[ $file == *"use-cases/manage-reading-lists.ts" ]]; then
            echo "feat: Manage reading lists use case"
        
        # Domain mocks and repositories
        elif [[ $file == *"mocks/cart-mock.ts" ]]; then
            echo "test: Add cart mock data for testing"
        elif [[ $file == *"repositories/cart-repository.ts" ]]; then
            echo "feat: Add cart repository interface"
        
        # Root config files
        elif [[ $file == "package.json" ]]; then
            echo "chore: Add root package configuration"
        elif [[ $file == "yarn.lock" ]]; then
            echo "chore: Add yarn lock file"
        
        else
            echo "feat: Add $basename"
        fi
        return
    fi
    
    # Handle modified files - generate message based on file type
    if [[ $file == ".gitignore" ]]; then
        echo "chore: Update .gitignore to exclude sensitive data"
    elif [[ $file == "README.md" ]]; then
        echo "docs: Update README documentation"
    elif [[ $file == *"package.json" ]]; then
        echo "chore: Update package dependencies"
    elif [[ $file == *"tsconfig.json" ]]; then
        echo "chore: Update TypeScript configuration"
    elif [[ $file == *"app.ts" ]]; then
        echo "refactor: Update Express app configuration"
    elif [[ $file == *"auth-controller.ts" ]]; then
        echo "refactor: Update authentication controller"
    elif [[ $file == *"product-controller.ts" ]]; then
        echo "refactor: Update product controller"
    elif [[ $file == *"products-db.ts" ]]; then
        echo "refactor: Update products database queries"
    elif [[ $file == *"auth-middleware.ts" ]]; then
        echo "refactor: Update authentication middleware"
    elif [[ $file == *"auth-routes.ts" ]]; then
        echo "refactor: Update authentication routes"
    elif [[ $file == *"product-routes.ts" ]]; then
        echo "refactor: Update product routes"
    elif [[ $file == *"type.ts" ]] || [[ $file == *"types/"* ]]; then
        echo "refactor: Update TypeScript type definitions"
    elif [[ $file == *"App.css" ]] || [[ $file == *"index.css" ]]; then
        echo "style: Update application styles"
    elif [[ $file == *"App.tsx" ]]; then
        echo "refactor: Update main App component"
    elif [[ $file == *"useBooks.ts" ]]; then
        echo "refactor: Update books custom hook"
    elif [[ $file == *"useProducts"* ]]; then
        echo "refactor: Update products custom hook"
    elif [[ $file == *"Button"* ]]; then
        echo "refactor: Update Button component"
    elif [[ $file == *"Spinner.tsx" ]]; then
        echo "refactor: Update Spinner component"
    elif [[ $file == *"auth.tsx" ]]; then
        echo "refactor: Update authentication component"
    elif [[ $file == *"ProductCard"* ]]; then
        echo "refactor: Update ProductCard component"
    elif [[ $file == *"ProductContainer.tsx" ]]; then
        echo "refactor: Update ProductContainer component"
    elif [[ $file == *"auth-context"* ]]; then
        echo "refactor: Update authentication context"
    elif [[ $file == *"useAuth.ts" ]]; then
        echo "refactor: Update auth custom hook"
    elif [[ $file == *"api.spec.ts" ]] || [[ $file == *"api.ts" ]]; then
        echo "refactor: Update API client"
    elif [[ $file == *"Footer.tsx" ]]; then
        echo "refactor: Update Footer component"
    elif [[ $file == *"NavBar.tsx" ]]; then
        echo "refactor: Update NavBar component"
    elif [[ $file == *"main.tsx" ]]; then
        echo "refactor: Update application entry point"
    elif [[ $file == *"ChangoPage.stories.tsx" ]]; then
        echo "refactor: Update ChangoPage stories"
    elif [[ $file == *"DetailProduct"* ]]; then
        echo "refactor: Update product detail page"
    elif [[ $file == *"ListProductPage.tsx" ]]; then
        echo "refactor: Update product list page"
    elif [[ $file == *"LoginPage.tsx" ]]; then
        echo "refactor: Update login page"
    elif [[ $file == *"RegisterPage.tsx" ]]; then
        echo "refactor: Update register page"
    elif [[ $file == *"product-service.ts" ]]; then
        echo "refactor: Update product service"
    elif [[ $file == *"auth.ts" ]]; then
        echo "refactor: Update auth service"
    elif [[ $file == *".stories."* ]]; then
        echo "refactor: Update Storybook stories"
    elif [[ $file == *"Header."* ]]; then
        echo "refactor: Update Header component"
    elif [[ $file == *"Page."* ]]; then
        echo "refactor: Update Page component"
    elif [[ $file == *"Products.ts" ]]; then
        echo "refactor: Update Products entity"
    elif [[ $file == *"product-mock.ts" ]]; then
        echo "test: Update product mock data"
    elif [[ $file == *"product-repository.ts" ]]; then
        echo "refactor: Update product repository"
    elif [[ $file == *"UserRepository.ts" ]]; then
        echo "refactor: Update user repository"
    elif [[ $file == *"create-product.spec.ts" ]]; then
        echo "test: Update create product tests"
    elif [[ $file == *"update-product"* ]]; then
        echo "refactor: Update product update logic"
    elif [[ $file == *"user-register.ts" ]]; then
        echo "refactor: Update user registration logic"
    elif [[ $file == *"vite-env.d.ts" ]]; then
        echo "chore: Update Vite environment types"
    elif [[ $file == "package-lock.json" ]]; then
        echo "chore: Update package lock file"
    else
        echo "refactor: Update $basename"
    fi
}

# Process tracked files (modified and deleted)
git status --porcelain | grep -E '^( M| D|M |D )' | tr -d '\r' | while IFS= read -r line; do
    status="${line:0:2}"
    file="${line:3}"
    
    message=$(generate_commit_message "$status" "$file")
    
    echo "Processing: $file"
    echo "Message: $message"
    
    if [[ $status == *"D"* ]]; then
        git rm "$file"
    else
        git add "$file"
    fi
    
    git commit -m "$message"
done

# Process untracked files
git status --porcelain | grep '^??' | tr -d '\r' | while IFS= read -r line; do
    file="${line:3}"
    
    # Skip directories, git will handle them when we add files
    if [[ -d "$file" ]]; then
        continue
    fi
    
    message=$(generate_commit_message "??" "$file")
    
    echo "Processing: $file"
    echo "Message: $message"
    
    git add "$file"
    git commit -m "$message"
done

echo ""
echo "✅ Finished committing all files individually with specific messages."
