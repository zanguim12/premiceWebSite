#!/bin/bash
# Script pour créer la structure complète du projet Premice Computer
# Exécuter depuis la racine du projet : bash create-structure.sh

echo "🚀 Création de la structure du projet Premice Computer..."

# Créer la structure des dossiers
mkdir -p src/app/core/models
mkdir -p src/app/core/services
mkdir -p src/app/core/guards
mkdir -p src/app/core/interceptors
mkdir -p src/app/shared/components/header
mkdir -p src/app/shared/components/footer
mkdir -p src/app/shared/components/product-card
mkdir -p src/app/shared/components/search-bar
mkdir -p src/app/shared/components/loader
mkdir -p src/app/shared/pipes
mkdir -p src/app/shared/directives
mkdir -p src/app/features/home
mkdir -p src/app/features/products/product-list
mkdir -p src/app/features/products/product-detail
mkdir -p src/app/features/products/product-filters
mkdir -p src/app/features/cart
mkdir -p src/app/features/checkout
mkdir -p src/app/features/pages/about
mkdir -p src/app/features/pages/contact
mkdir -p src/app/layout/main-layout
mkdir -p src/assets/data
mkdir -p src/assets/images/products
mkdir -p src/assets/images/brands
mkdir -p src/assets/images/banners

echo "✅ Structure des dossiers créée avec succès !"
echo ""
echo "📂 Structure créée :"
echo "   src/app/core/           → Services, Models, Guards"
echo "   src/app/shared/         → Composants réutilisables"
echo "   src/app/features/       → Pages et fonctionnalités"
echo "   src/app/layout/         → Layout principal"
echo "   src/assets/data/        → Fichiers JSON mockés"
echo "   src/assets/images/      → Images du site"
echo ""
echo "🎯 Prochaine étape : Je vais vous fournir les fichiers de code !"
