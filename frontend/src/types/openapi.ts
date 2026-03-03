export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AppController_getHello"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        // Register a new user
        post: operations["AuthController_register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        //Refresh access token
        post: operations["AuthController_refresh"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        // Logout user
        post: operations["AuthController_logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        //User login
        post: operations["AuthController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get current user profile */
        get: operations["UsersController_getProfile"];
        put?: never;
        post?: never;
        /** Delete current user account */
        delete: operations["UsersController_deleteAccount"];
        options?: never;
        head?: never;
        /** Update current user profile */
        patch: operations["UsersController_updateProfile"];
        trace?: never;
    };
    "/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all users */
        get: operations["UsersController_findAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get user by ID */
        get: operations["UsersController_findOne"];
        put?: never;
        post?: never;
        /** Delete user by ID */
        delete: operations["UsersController_deleteUser"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Change current user password */
        patch: operations["UsersController_changePassword"];
        trace?: never;
    };
    "/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all categories */
        get: operations["CategoryController_findAll"];
        put?: never;
        /** Create a new category */
        post: operations["CategoryController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/slug/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get category by slug */
        get: operations["CategoryController_findBySlug"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get category by ID */
        get: operations["CategoryController_findOne"];
        put?: never;
        post?: never;
        /** Delete category (Admin Only) */
        delete: operations["CategoryController_remove"];
        options?: never;
        head?: never;
        /** Update category (Admin only) */
        patch: operations["CategoryController_update"];
        trace?: never;
    };
    "/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all products with optional filters */
        get: operations["ProductsController_findAll"];
        put?: never;
        /** Create a new product (Admin Only) */
        post: operations["ProductsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get product by id */
        get: operations["ProductsController_findOne"];
        put?: never;
        post?: never;
        /** Delete product (Admin Only) */
        delete: operations["ProductsController_remove"];
        options?: never;
        head?: never;
        /** Update a product (Admin Only) */
        patch: operations["ProductsController_update"];
        trace?: never;
    };
    "/products/{id}/stock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update product stock (Admin Only) */
        patch: operations["ProductsController_updateStock"];
        trace?: never;
    };
    "/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all orders for current user (paginated) */
        get: operations["OrdersController_findAll"];
        put?: never;
        /** Create a new order */
        post: operations["OrdersController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/admin/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN] Get all orders (paginated) */
        get: operations["OrdersController_findAllForAdmin"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/admin/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN]: Get order by id */
        get: operations["OrdersController_findOneAdmin"];
        put?: never;
        post?: never;
        /** ADMIN cancel order by ID */
        delete: operations["OrdersController_cancelAdmin"];
        options?: never;
        head?: never;
        /** [ADMIN] Update any order */
        patch: operations["OrdersController_updateAdmin"];
        trace?: never;
    };
    "/orders/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an order by ID for current user */
        get: operations["OrdersController_findOne"];
        put?: never;
        post?: never;
        /** User cancel order by ID */
        delete: operations["OrdersController_cancel"];
        options?: never;
        head?: never;
        /** Update your own order */
        patch: operations["OrdersController_update"];
        trace?: never;
    };
    "/payments/flouci/initiate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        //Initier un paiement
        post: operations["FlouciController_initiatePayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        //Webhook Flouci
        post: operations["FlouciController_handleWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Vérifier le statut d'un paiement */
        post: operations["FlouciController_verifyPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/status/{orderId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtenir le statut d'un paiement */
        get: operations["FlouciController_getPaymentStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        //Annuler un paiement
        post: operations["FlouciController_cancelPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/test/simulate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        //Simuler un paiement de test (sandbox uniquement)
        post: operations["FlouciController_simulateTestPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/test/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Configuration du mode test */
        get: operations["FlouciController_getTestConfig"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/admin/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Statistiques de paiement (Admin) */
        get: operations["FlouciController_getPaymentStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/admin/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN] Liste des paiements */
        get: operations["FlouciController_getPayments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/admin/payments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN] Détail dun paiement */
        get: operations["FlouciController_getPaymentDetail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/admin/payments/{id}/refund": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** [ADMIN] Rembourser un paiement */
        post: operations["FlouciController_refundPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/admin/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN] Configuration Flouci */
        get: operations["FlouciController_getConfig"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/flouci/admin/trends": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN] Tendance des paiements */
        get: operations["FlouciController_getPaymentTrends"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtenir le panier de l'utilisateur */
        get: operations["CartsController_getCart"];
        put?: never;
        post?: never;
        /** Vider le panier */
        delete: operations["CartsController_clearCart"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtenir le nombre d'items dans le panier */
        get: operations["CartsController_getCartCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Ajouter un produit au panier */
        post: operations["CartsController_addToCart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/items/{cartItemId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Mettre à jour un item du panier */
        put: operations["CartsController_updateCartItem"];
        post?: never;
        /** Supprimer un item du panier */
        delete: operations["CartsController_removeCartItem"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Valider le panier avant checkout */
        get: operations["CartsController_validateCart"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/checkout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Passer commande (checkout) */
        post: operations["CartsController_checkout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        //Créer un avis sur un produit
        post: operations["ReviewsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/product/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        //Récupérer les avis d'un produit
        get: operations["ReviewsController_findByProduct"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/product/{productId}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        //Récupérer le résumé des notes d'un produit
        get: operations["ReviewsController_getProductRatingSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        //Récupérer mes avis
        get: operations["ReviewsController_findMyReviews"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Récupérer un avis par son ID */
        get: operations["ReviewsController_findOne"];
        put?: never;
        post?: never;
        /** Supprimer mon avis */
        delete: operations["ReviewsController_remove"];
        options?: never;
        head?: never;
        //Mettre à jour mon avis
        patch: operations["ReviewsController_update"];
        trace?: never;
    };
    "/reviews/can-review/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Vérifier si l'utilisateur peut laisser un avis
         * @description Vérifie si l'utilisateur a acheté le produit
         */
        get: operations["ReviewsController_canReview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/admin/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN] Liste tous les avis (modération) */
        get: operations["ReviewsController_findAllForAdmin"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/admin/{id}/hide": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** [ADMIN] Masquer un avis */
        patch: operations["ReviewsController_hideReview"];
        trace?: never;
    };
    "/reviews/admin/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** [ADMIN] Approuver un avis */
        patch: operations["ReviewsController_approveReview"];
        trace?: never;
    };
    "/reviews/admin/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** [ADMIN] Supprimer définitivement un avis */
        delete: operations["ReviewsController_deleteReviewAdmin"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/admin/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN] Statistiques des avis */
        get: operations["ReviewsController_getStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/discounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Récupérer tous les codes promo (Admin uniquement) */
        get: operations["DiscountsController_findAll"];
        put?: never;
        /** Créer un code promo (Admin uniquement) */
        post: operations["DiscountsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/discounts/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Statistiques des codes promo (Admin uniquement) */
        get: operations["DiscountsController_getStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/discounts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Récupérer un code promo par ID (Admin uniquement) */
        get: operations["DiscountsController_findOne"];
        put?: never;
        post?: never;
        /** Supprimer un code promo (Admin uniquement) */
        delete: operations["DiscountsController_remove"];
        options?: never;
        head?: never;
        /** Mettre à jour un code promo (Admin uniquement) */
        patch: operations["DiscountsController_update"];
        trace?: never;
    };
    "/discounts/{id}/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Activer un code promo (Admin uniquement) */
        patch: operations["DiscountsController_activate"];
        trace?: never;
    };
    "/discounts/{id}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Désactiver un code promo (Admin uniquement) */
        patch: operations["DiscountsController_deactivate"];
        trace?: never;
    };
    "/discounts/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Valider un code promo
         * @description Vérifie si un code promo est valide et utilisable
         */
        post: operations["DiscountsController_validate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/discounts/apply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Appliquer un code promo
         * @description Calcule la remise pour un montant donné
         */
        post: operations["DiscountsController_apply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/embeddings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Générer un embedding vectoriel
         * @description Encode un texte en vecteur sémantique avec OpenAI
         */
        post: operations["AiController_generateEmbedding"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Recherche sémantique
         * @description Recherche dans la base de connaissances par similarité cosinus
         */
        post: operations["AiController_semanticSearch"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/chat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Chatbot conversationnel
         * @description Assistant commercial basé sur RAG pour l'e-commerce
         */
        post: operations["AiController_chatbot"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/chat/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Créer une session de chat */
        post: operations["AiController_createChatSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/recommendations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Recommandations de produits
         * @description Basées sur lhistorique dachat et le comportement
         */
        post: operations["AiController_getRecommendations"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/sentiment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Analyse de sentiment
         * @description Analyse le sentiment dun texte (avis, commentaire, etc.)
         */
        post: operations["AiController_analyzeSentiment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/seo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Génération SEO
         * @description Génère des méta-données optimisées pour le SEO
         */
        post: operations["AiController_generateSEO"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/knowledge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Ajouter un document (Admin)
         * @description Ajoute un document à la base de connaissances RAG
         */
        post: operations["AiController_addKnowledgeDocument"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/knowledge/product": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Indexer un produit (Admin)
         * @description Crée un embedding pour un produit
         */
        post: operations["AiController_indexProduct"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/knowledge/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Statistiques de la base de connaissances */
        get: operations["AiController_getKnowledgeBaseStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/products/similar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Rechercher des produits similaires
         * @description Recherche des produits similaires à une requête textuelle (ex: "chaussures pour homme") en utilisant la recherche vectorielle pgvector
         */
        get: operations["AiController_searchSimilarProducts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Vérifier ltat du service AI */
        get: operations["AiController_healthCheck"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/trigger": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Déclencher un workflow personnalisé
         * @description Envoie un événement à un webhook n8n spécifique
         */
        post: operations["WorkflowsController_triggerWorkflow"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/order/confirmation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirmer une commande (Admin)
         * @description Déclenche l'email de confirmation de commande
         */
        post: operations["WorkflowsController_confirmOrder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/stock/alert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Alerte stock faible (Admin)
         * @description Déclenche une alerte pour un produit en rupture
         */
        post: operations["WorkflowsController_triggerLowStock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/stock/check-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Vérifier tout le stock (Admin)
         * @description Vérifie tous les produits et envoie des alertes
         */
        post: operations["WorkflowsController_checkAllStock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/cart/abandoned": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Notifier panier abandonné (Admin)
         * @description Envoie une notification pour un panier abandonné
         */
        post: operations["WorkflowsController_triggerAbandonedCart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/cart/check-abandoned": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Notifier tous les paniers abandonnés (Admin)
         * @description Trouve et notifie tous les paniers abandonnés
         */
        post: operations["WorkflowsController_checkAbandonedCarts"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Vérifier la santé du service
         * @description Retourne le statut des webhooks n8n
         */
        get: operations["WorkflowsController_healthCheck"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Liste des événements disponibles
         * @description Retourne la liste des types de workflows disponibles
         */
        get: operations["WorkflowsController_getEventTypes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/admin/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * [ADMIN] Historique des workflows
         * @description Liste des dernières exécutions de workflows
         */
        get: operations["WorkflowsController_getWorkflowHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/admin/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** [ADMIN] Statistiques des workflows */
        get: operations["WorkflowsController_getWorkflowStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/admin/webhooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * [ADMIN] Configuration des webhooks
         * @description Liste des webhooks n8n configurés
         */
        get: operations["WorkflowsController_getWebhooksConfig"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workflows/admin/webhooks/{name}/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** [ADMIN] Tester un webhook */
        post: operations["WorkflowsController_testWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/analytics/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Vue densemble des KPIs
         * @description Récupère les indicateurs clés : CA, commandes, clients, etc.
         */
        get: operations["AnalyticsController_getOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/analytics/sales-trend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Tendance des ventes
         * @description Évolution du CA et des commandes dans le temps
         */
        get: operations["AnalyticsController_getSalesTrend"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/analytics/products/bestsellers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Produits les plus vendus
         * @description Top des produits par quantité vendue
         */
        get: operations["AnalyticsController_getBestSellers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/analytics/orders/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Répartition des commandes par statut
         * @description Nombre de commandes par statut (PENDING, SHIPPED, etc.)
         */
        get: operations["AnalyticsController_getOrdersByStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/analytics/customers/top": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Top clients
         * @description Clients les plus actifs par nombre de commandes
         */
        get: operations["AnalyticsController_getTopCustomers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/analytics/revenue/by-category": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Chiffre daffaires par catégorie
         * @description Répartition du CA par catégorie de produits
         */
        get: operations["AnalyticsController_getRevenueByCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/analytics/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Dashboard complet
         * @description Tous les KPIs principaux en un seul appel
         */
        get: operations["AnalyticsController_getDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Dashboard complet
         * @description Vue densemble de tous les KPIs et données importantes
         */
        get: operations["AdminController_getDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/users/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Statistiques des utilisateurs
         * @description Nombre total, nouveaux utilisateurs, répartition par rôle
         */
        get: operations["AdminController_getUserStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Liste des utilisateurs
         * @description Liste paginée avec filtres et recherche
         */
        get: operations["AdminController_getUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/users/{id}/ban": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Bannir un utilisateur
         * @description Désactive le compte dun utilisateur
         */
        post: operations["AdminController_banUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/products/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Statistiques des produits
         * @description Nombre total, produits actifs, valeur du stock
         */
        get: operations["AdminController_getProductStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Liste des produits
         * @description Liste paginée avec filtres et recherche
         */
        get: operations["AdminController_getProducts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/products/stock-alerts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Alertes de stock
         * @description Produits en rupture ou stock faible
         */
        get: operations["AdminController_getStockAlerts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/orders/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Statistiques des commandes
         * @description Répartition par statut, taux dannulation
         */
        get: operations["AdminController_getOrderStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Liste des commandes
         * @description Liste paginée avec filtres et recherche
         */
        get: operations["AdminController_getOrders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/system/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Health check
         * @description Vérifie létat des services
         */
        get: operations["AdminController_healthCheck"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/activity/recent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Activités récentes
         * @description Dernières actions sur la plateforme
         */
        get: operations["AdminController_getRecentActivity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/gdpr/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Exporter mes données personnelles
         * @description Téléchargez toutes vos données personnelles (Conformité RGPD - Article 15)
         */
        get: operations["GdprController_exportData"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/gdpr/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Résumé des données stockées
         * @description Voir quelles données sont stockées et leur durée de conservation
         */
        get: operations["GdprController_getDataSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/gdpr/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Modifier mes données personnelles
         * @description Mettez à jour vos informations (Conformité RGPD - Article 16)
         */
        patch: operations["GdprController_updateData"];
        trace?: never;
    };
    "/gdpr/delete-account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Supprimer mon compte
         * @description Demandez la suppression de votre compte et de vos données (Conformité RGPD - Article 17)
         */
        delete: operations["GdprController_deleteAccount"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/gdpr/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Informations RGPD
         * @description Politique de confidentialité et droits des utilisateurs
         */
        get: operations["GdprController_getGdprInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cache/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Statistiques du cache Redis
         * @description Nombre de clés, mémoire utilisée, état de la connexion
         */
        get: operations["CacheController_getStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cache/exists/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Vérifier si une clé existe */
        get: operations["CacheController_exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cache/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Supprimer une clé du cache */
        delete: operations["CacheController_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cache/pattern/{path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Vider le cache par pattern
         * @description Supprime toutes les clés correspondant au pattern
         */
        delete: operations["CacheController_deleteByPattern"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cache/flush": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Vider tout le cache
         * @description ⚠️ Action destructive - Supprime toutes les clés
         */
        delete: operations["CacheController_flush"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cache/keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lister les clés du cache
         * @description Retourne les clés correspondant au pattern (max 100)
         */
        get: operations["CacheController_getKeys"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/images/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Uploader une image
         * @description Upload et optimisation automatique dune image
         */
        post: operations["ImagesController_uploadImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/images/{filename}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Supprimer une image */
        delete: operations["ImagesController_deleteImage"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wishlist": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtenir ma wishlist
         * @description Récupère la liste des produits favoris de lutilisateur
         */
        get: operations["WishlistController_getWishlist"];
        put?: never;
        post?: never;
        /** Vider la wishlist */
        delete: operations["WishlistController_clearWishlist"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wishlist/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Ajouter un produit à la wishlist */
        post: operations["WishlistController_addItem"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wishlist/items/{itemId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Retirer un produit (par ID élément) */
        delete: operations["WishlistController_removeItem"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wishlist/product/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Retirer un produit (par ID produit) */
        delete: operations["WishlistController_removeProduct"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wishlist/check/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Vérifier si un produit est dans la wishlist */
        get: operations["WishlistController_checkProduct"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Enregistrer une recherche
         * @description Log une recherche utilisateur pour les recommandations
         */
        post: operations["SearchHistoryController_logSearch"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtenir mon historique */
        get: operations["SearchHistoryController_getHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/trends/popular": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Recherches populaires
         * @description Top des recherches sur la plateforme
         */
        get: operations["SearchHistoryController_getPopularSearches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/trends": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Tendances de recherche (Admin) */
        get: operations["SearchHistoryController_getTrends"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/cleanup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Nettoyer lhistorique ancien (Admin) */
        post: operations["SearchHistoryController_cleanup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat-feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Soumettre un feedback
         * @description Notez la qualité dune réponse du chatbot
         */
        post: operations["ChatFeedbackController_submitFeedback"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat-feedback/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Statistiques de satisfaction (Admin) */
        get: operations["ChatFeedbackController_getStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat-feedback/trends": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Tendances de satisfaction (Admin) */
        get: operations["ChatFeedbackController_getTrends"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat-feedback/recent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Feedbacks récents (Admin) */
        get: operations["ChatFeedbackController_getRecent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat-feedback/improvements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Commentaires négatifs (Admin)
         * @description Feedbacks négatifs pour améliorer le chatbot
         */
        get: operations["ChatFeedbackController_getImprovements"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        RegisterDto: {
            /**
             * @description User email address
             * @example john.doe@example.com
             */
            email: string;
            /**
             * @description User password
             * @example StrongP@ssw0rd!
             */
            password: string;
            /**
             * @description User first name
             * @example John
             */
            firstName?: string;
            /**
             * @description User last name
             * @example Doe
             */
            lastName?: string;
        };
        AuthResponseDto: {
            /**
             * @description Access token for authentication
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
             */
            accessToken: string;
            /**
             * @description Refresh token for obtaining new access tokens
             * @example dGhpcy1pcz1hLXJlZnJlc2gtdG9rZW4tZXhhbXBsZS13aXRoLXN1ZmZpY2lhbC1jaGFyYWN0ZXJzIQ==
             */
            refreshToken: string;
            /**
             * @description Authenticated user information
             * @example {
             *       "id": "user-123",
             *       "email": "<EMAIL>",
             *       "firstName": "John",
             *       "lastName": "Doe",
             *       "role": "USER"
             *     }
             */
            user: Record<string, never>;
        };
        LoginDto: {
            /**
             * @description User email address
             * @example john.doe@example.com
             */
            email: string;
            /**
             * @description User password
             * @example StrongP@ssw0rd!
             */
            password: string;
        };
        UserResponseDto: {
            /**
             * @description User ID
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            id: string;
            /**
             * @description User email address
             * @example user@example.com
             */
            email: string;
            /**
             * @description User first name
             * @example John
             */
            firstName: Record<string, never> | null;
            /**
             * @description User last name
             * @example Doe
             */
            lastName: Record<string, never> | null;
            /**
             * @description User role
             * @enum {string}
             */
            role: "USER" | "ADMIN";
            /**
             * Format: date-time
             * @description Account creation date
             * @example 2023-10-01T12:34:56.789Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @description Last account update date
             * @example 2023-10-10T12:34:56.789Z
             */
            updatedAt: string;
        };
        UpdateUserDto: {
            /**
             * @description User eamil address
             * @example user@example.com
             */
            email?: string;
            /**
             * @description User first name
             * @example John
             */
            firstName?: string;
            /**
             * @description User last name
             * @example Doe
             */
            lastName?: string;
        };
        ChangePasswordDto: {
            /**
             * @description New password for the user
             * @example NewP@ssw0rd!
             */
            currentPassword: string;
            /**
             * @description New password for the user
             * @example NewP@ssw0rd!
             */
            newPassword: string;
        };
        CreateCategoryDto: {
            /**
             * @description The name of the category
             * @example Electronics
             */
            name: string;
            /**
             * @description A brief description of the category
             * @example Devices and gadgets including phones, laptops, and accessories
             */
            description?: string;
            /**
             * @description The URL-friendly slug for the category
             * @example electronics
             */
            slug?: string;
            /**
             * @description URL of the category image
             * @example https://example.com/images/electronics.png
             */
            imageUrl?: string;
            /**
             * @description Indicates if the category is active
             * @default true
             * @example true
             */
            isActive: boolean;
        };
        Object: Record<string, never>;
        CategoryResponseDto: {
            /**
             * @description The unique identifier of the category
             * @example 550e484-ere8458454-45erer4844858
             */
            id: string;
            /**
             * @description The name of the category
             * @example Electronics
             */
            name: string;
            /**
             * @description A brief description of the category
             * @example Devices and gadgets including phones, laptops, and accessories
             */
            description: Record<string, never> | null;
            /**
             * @description The URL-friendly slug for the category
             * @example electronics
             */
            slug: Record<string, never> | null;
            /**
             * @description URL of the category image
             * @example https://example.com/images/electronics.png
             */
            imageUrl: Record<string, never> | null;
            /**
             * @description Indicates if the category is active
             * @example true
             */
            isActive: boolean;
            /**
             * @description Number of products in this category
             * @example 150
             */
            productCount: number;
            /**
             * Format: date-time
             * @description The date and time when the category was created
             * @example 2024-01-01T12:00:00Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @description The date and time when the category was last updated
             * @example 2024-01-10T15:30:00Z
             */
            updatedAt: string;
        };
        UpdateCategoryDto: {
            /**
             * @description The name of the category
             * @example Electronics
             */
            name?: string;
            /**
             * @description A brief description of the category
             * @example Devices and gadgets including phones, laptops, and accessories
             */
            description?: string;
            /**
             * @description The URL-friendly slug for the category
             * @example electronics
             */
            slug?: string;
            /**
             * @description URL of the category image
             * @example https://example.com/images/electronics.png
             */
            imageUrl?: string;
            /**
             * @description Indicates if the category is active
             * @default true
             * @example true
             */
            isActive: boolean;
        };
        CreateProductDto: {
            /**
             * @description Product name
             * @example Wireless Headphones
             */
            name: string;
            /**
             * @description Prodcut description
             * @example High-quality wireless headphoneswith noise cancellation
             */
            description?: string;
            /**
             * @description Product price in USD
             * @example 99.99
             */
            price: number;
            /**
             * @description Stock quantity
             * @example 100
             */
            stock: number;
            /**
             * @description Stock keeping Unit (Sku) -unique identifier
             * @example WH-001
             */
            sku: string;
            /**
             * @description Product image url
             * @example https://example.com/image.jpg
             */
            imageUrl?: string;
            /**
             * @description Product category
             * @example Electronics
             */
            categoryId: string;
            /**
             * @description Whether product is active and available for purchase
             * @default true
             * @example true
             */
            isActive: boolean;
        };
        ProductResponseDto: {
            /**
             * @description Product ID
             * @example 46545646sds-4584s68sd-4654684sd
             */
            id: string;
            /**
             * @description Product name
             * @example Wireless Headphone
             */
            name: string;
            /**
             * @description Product description
             * @example High quality wireless headphones
             */
            description: Record<string, never> | null;
            /**
             * @description Product price
             * @example 99.99
             */
            price: number;
            /**
             * @description Product stock
             * @example 100
             */
            stock: number;
            /**
             * @description Stock keeping Unit
             * @example WH-001
             */
            sku: string;
            /**
             * @description Product image url
             * @example https://example.com/image.jpg
             */
            imageUrl: Record<string, never>;
            /**
             * @description Product category
             * @example Electronics
             */
            category: Record<string, never>;
            /**
             * @description Product availability status
             * @example true
             */
            isActive: boolean;
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt: string;
            /**
             * Format: date-time
             * @description last update timestamp
             */
            updatedAt: string;
        };
        UpdateProductDto: {
            /**
             * @description Product name
             * @example Wireless Headphones
             */
            name?: string;
            /**
             * @description Prodcut description
             * @example High-quality wireless headphoneswith noise cancellation
             */
            description?: string;
            /**
             * @description Product price in USD
             * @example 99.99
             */
            price?: number;
            /**
             * @description Stock quantity
             * @example 100
             */
            stock?: number;
            /**
             * @description Stock keeping Unit (Sku) -unique identifier
             * @example WH-001
             */
            sku?: string;
            /**
             * @description Product image url
             * @example https://example.com/image.jpg
             */
            imageUrl?: string;
            /**
             * @description Product category
             * @example Electronics
             */
            categoryId?: string;
            /**
             * @description Whether product is active and available for purchase
             * @default true
             * @example true
             */
            isActive: boolean;
        };
        OrderItemDto: {
            productId: string;
            quantity: number;
            /** @example 49.99 */
            price?: number;
        };
        CreateOrderDto: {
            items: components["schemas"]["OrderItemDto"][];
            shippingAddress?: string;
        };
        OrderApiResponseDto: {
            /** @description Indicates if the request was successfull */
            success: boolean;
            /** @description Returned data */
            data: Record<string, never>;
            /** @description Optional message */
            message?: string | null;
        };
        OrderItemResponseDto: {
            id: string;
            productId: string;
            productName: string;
            quantity: number;
            price: number;
            subtotal: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        OrderResponseDto: {
            id: string;
            userId: string;
            status: string;
            total: number;
            shippingAddress: string;
            items: components["schemas"]["OrderItemResponseDto"][];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        PaginatedOrderResponseDto: {
            data: components["schemas"]["OrderResponseDto"][];
            total: number;
            page: number;
            limit: number;
        };
        UpdateOrderDto: Record<string, never>;
        InitiatePaymentDto: {
            /**
             * @description ID de la commande
             * @example order-uuid-123
             */
            orderId: string;
            /**
             * @description Montant en dinars tunisiens
             * @example 99.99
             */
            amount: number;
            /**
             * @description Raison du paiement
             * @example Paiement commande #12345
             */
            paymentReason?: string;
            /**
             * @description Email du client
             * @example client@example.com
             */
            customerEmail?: string;
            /**
             * @description Numéro de téléphone du client
             * @example +216 98 765 432
             */
            customerPhone?: string;
            /**
             * @description URL de retour personnalisée
             * @example http://localhost:3000/payment/return
             */
            returnUrl?: string;
            /**
             * @description Métadonnées additionnelles
             * @example {
             *       "cartId": "cart-uuid",
             *       "userId": "user-uuid"
             *     }
             */
            metadata?: Record<string, never>;
        };
        PaymentInitiationResponseDto: {
            /**
             * @description Succès de l'opération
             * @example true
             */
            success: boolean;
            /**
             * @description ID du paiement Flouci
             * @example flouci-payment-id
             */
            paymentId: string;
            /**
             * @description Lien de redirection vers Flouci
             * @example https://sandbox.flouci.com/payment/xxx
             */
            paymentLink: string;
            /**
             * @description ID de tracking
             * @example order-uuid-timestamp
             */
            trackingId: string;
            /**
             * @description Montant en dinars
             * @example 99.99
             */
            amount: number;
            /**
             * @description Devise
             * @example TND
             */
            currency: string;
            /**
             * @description Date d'expiration
             * @example 2024-01-01T13:00:00Z
             */
            expiresAt: string;
            /**
             * @description Message
             * @example Paiement initié avec succès
             */
            message?: string;
        };
        WebhookResponseDto: {
            /**
             * @description Webhook reçu avec succès
             * @example true
             */
            received: boolean;
            /**
             * @description Message de confirmation
             * @example Webhook traité avec succès
             */
            message: string;
            /**
             * @description ID de la commande mise à jour
             * @example order-uuid-123
             */
            orderId?: string;
            /**
             * @description Nouveau statut de la commande
             * @example PAID
             */
            orderStatus?: string;
        };
        VerifyPaymentDto: {
            /**
             * @description ID de tracking développeur
             * @example order-uuid-timestamp
             */
            developerTrackingId: string;
            /**
             * @description ID du paiement Flouci
             * @example flouci-payment-id
             */
            paymentId?: string;
        };
        PaymentVerificationResponseDto: {
            /**
             * @description Succès
             * @example true
             */
            success: boolean;
            /**
             * @description ID du paiement
             * @example flouci-payment-id
             */
            paymentId: string;
            /**
             * @description ID de tracking
             * @example order-uuid-timestamp
             */
            trackingId: string;
            /**
             * @description Statut du paiement
             * @example SUCCESS
             * @enum {string}
             */
            status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";
            /**
             * @description Montant en dinars
             * @example 99.99
             */
            amount: number;
            /**
             * @description Devise
             * @example TND
             */
            currency: string;
            /**
             * @description Date du paiement
             * @example 2024-01-01T12:05:00Z
             */
            paidAt: string;
            /**
             * @description Message d'erreur
             * @example Paiement effectué avec succès
             */
            message?: string;
        };
        PaymentStatusResponseDto: {
            /**
             * @description ID du paiement
             * @example flouci-payment-id
             */
            paymentId: string;
            /**
             * @description ID de tracking
             * @example order-uuid-timestamp
             */
            trackingId: string;
            /**
             * @description ID de la commande associée
             * @example order-uuid-123
             */
            orderId: string;
            /**
             * @description Montant
             * @example 99.99
             */
            amount: number;
            /**
             * @description Devise
             * @example TND
             */
            currency: string;
            /**
             * @description Statut
             * @example SUCCESS
             * @enum {string}
             */
            status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED" | "CANCELLED";
            /**
             * @description Raison du paiement
             * @example Paiement commande #12345
             */
            paymentReason: string;
            /**
             * @description Date de création
             * @example 2024-01-01T12:00:00Z
             */
            createdAt: string;
            /**
             * @description Date de mise à jour
             * @example 2024-01-01T12:05:00Z
             */
            updatedAt: string;
            /**
             * @description Date de paiement
             * @example 2024-01-01T12:05:00Z
             */
            paidAt?: string;
            /**
             * @description Mode de paiement
             * @example CARD
             */
            paymentMethod?: string;
            /**
             * @description Métadonnées
             * @example {
             *       "userId": "user-uuid"
             *     }
             */
            metadata?: Record<string, never>;
        };
        TestWalletPaymentDto: {
            /**
             * @description ID de la commande
             * @example order-uuid-123
             */
            orderId: string;
            /**
             * @description Montant en dinars
             * @example 10
             */
            amount: number;
            /**
             * @description Numéro de wallet de test (111111 = succès, 000000 = échec)
             * @example 111111
             */
            testWalletNumber: string;
            /**
             * @description Raison du paiement
             * @example Test paiement
             */
            paymentReason?: string;
        };
        TestModeConfigResponseDto: {
            /**
             * @description Mode sandbox activé
             * @example true
             */
            sandboxEnabled: boolean;
            /**
             * @description Numéro de wallet pour succès
             * @example 111111
             */
            successWallet: string;
            /**
             * @description Numéro de wallet pour échec
             * @example 000000
             */
            failureWallet: string;
            /**
             * @description Instructions pour le mode test
             * @example Utilisez le numéro 111111 pour simuler un paiement réussi
             */
            instructions: string;
        };
        AddToCartDto: {
            /**
             * @description ID du produit à ajouter au panier
             * @example 550e8400-e29b-41d4-a716-446655440000
             */
            productId: string;
            /**
             * @description Quantité du produit
             * @default 1
             */
            quantity: number;
        };
        UpdateCartDto: {
            /**
             * @description ID du produit à ajouter au panier
             * @example 550e8400-e29b-41d4-a716-446655440000
             */
            productId?: string;
            /**
             * @description Nouvelle quantité du produit
             * @default 1
             */
            quantity: number;
        };
        CheckoutDto: {
            /**
             * @description ID du panier (si non fourni, utilise le panier actif)
             * @example 550e8400-e29b-41d4-a716-446655440000
             */
            cartId?: string;
            /**
             * @description Code promo (si applicable)
             * @example PROMO2024
             */
            discountCode?: string;
            /**
             * @description Adresse de livraison
             * @example 123 Rue de Tunis, Tunis 1000
             */
            shippingAddress: string;
            /**
             * @description Méthode de paiement
             * @example flouci
             * @enum {string}
             */
            paymentMethod: "flouci" | "cash_on_delivery";
            /**
             * @description Notes supplémentaires
             * @example Laisser le colis à la porte
             */
            notes?: string;
        };
        CreateReviewDto: {
            /**
             * @description ID du produit à évaluer
             * @example uuid-du-produit
             */
            productId: string;
            /**
             * @description Note du produit (1-5 étoiles)
             * @example 5
             */
            rating: number;
            /**
             * @description Commentaire optionnel de l'avis
             * @example Excellent produit, je recommande vivement !
             */
            comment?: string;
        };
        ReviewResponseDto: {
            /**
             * @description ID unique de l'avis
             * @example uuid-avis
             */
            id: string;
            /**
             * @description Note du produit (1-5)
             * @example 5
             */
            rating: number;
            /**
             * @description Commentaire de l'avis
             * @example Excellent produit !
             */
            comment?: string;
            /**
             * @description ID du produit évalué
             * @example uuid-produit
             */
            productId: string;
            /**
             * @description ID de l'utilisateur qui a rédigé l'avis
             * @example uuid-utilisateur
             */
            userId: string;
            /**
             * @description Prénom de l'utilisateur
             * @example Mohamed
             */
            userFirstName?: string;
            /**
             * @description Nom de l'utilisateur
             * @example Ben Ali
             */
            userLastName?: string;
            /**
             * Format: date-time
             * @description Date de création de l'avis
             * @example 2024-01-15T10:30:00.000Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @description Date de dernière mise à jour
             * @example 2024-01-15T10:30:00.000Z
             */
            updatedAt: string;
        };
        ProductRatingSummaryDto: {
            /**
             * @description ID du produit
             * @example uuid-produit
             */
            productId: string;
            /**
             * @description Note moyenne calculée
             * @example 4.5
             */
            averageRating: number;
            /**
             * @description Nombre total d'avis
             * @example 42
             */
            totalReviews: number;
            /**
             * @description Répartition des notes
             * @example {
             *       "1": 2,
             *       "2": 5,
             *       "3": 8,
             *       "4": 15,
             *       "5": 12
             *     }
             */
            ratingDistribution: Record<string, never>;
        };
        PaginatedReviewsResponseDto: {
            /** @description Liste des avis */
            data: components["schemas"]["ReviewResponseDto"][];
            /**
             * @description Métadonnées de pagination
             * @example {
             *       "total": 100,
             *       "page": 1,
             *       "limit": 10,
             *       "totalPages": 10
             *     }
             */
            meta: Record<string, never>;
            /** @description Résumé des notes du produit */
            ratingSummary?: components["schemas"]["ProductRatingSummaryDto"];
        };
        UpdateReviewDto: {
            /**
             * @description Nouvelle note du produit (1-5)
             * @example 4
             */
            rating?: number;
            /**
             * @description Nouveau commentaire de l'avis
             * @example Produit de bonne qualité, livraison rapide.
             */
            comment?: string;
        };
        CreateDiscountDto: {
            /**
             * @description Code promo unique
             * @example SUMMER2024
             */
            code: string;
            /**
             * @description Type de remise (PERCENTAGE ou FIXED)
             * @example PERCENTAGE
             * @enum {string}
             */
            type: "PERCENTAGE" | "FIXED";
            /**
             * @description Valeur de la remise (pourcentage ou montant fixe en TND)
             * @example 20
             */
            value: number;
            /**
             * @description Description de la promotion
             * @example Réduction été 2024
             */
            description?: string;
            /**
             * @description Date d'expiration du code promo
             * @example 2024-12-31T23:59:59.000Z
             */
            expiresAt: string;
            /**
             * @description Montant minimum pour appliquer le code (en TND)
             * @example 50
             */
            minAmount?: number;
            /**
             * @description Nombre maximum d'utilisations
             * @example 100
             */
            maxUses?: number;
            /**
             * @description Code actif ou non
             * @default true
             */
            isActive: boolean;
        };
        DiscountResponseDto: {
            /**
             * @description ID unique du code promo
             * @example uuid-discount
             */
            id: string;
            /**
             * @description Code promo
             * @example SUMMER2024
             */
            code: string;
            /**
             * @description Type de remise
             * @example PERCENTAGE
             * @enum {string}
             */
            type: "PERCENTAGE" | "FIXED";
            /**
             * @description Valeur de la remise
             * @example 20
             */
            value: number;
            /**
             * @description Description de la promotion
             * @example Réduction été 2024
             */
            description?: string;
            /**
             * @description Code actif ou non
             * @example true
             */
            isActive: boolean;
            /**
             * Format: date-time
             * @description Date d'expiration
             * @example 2024-12-31T23:59:59.000Z
             */
            expiresAt: string;
            /**
             * @description Montant minimum pour appliquer le code
             * @example 50
             */
            minAmount?: number;
            /**
             * @description Nombre maximum d'utilisations
             * @example 100
             */
            maxUses?: number;
            /**
             * @description Nombre d'utilisations actuelles
             * @example 25
             */
            usedCount: number;
            /**
             * Format: date-time
             * @description Date de création
             * @example 2024-01-15T10:30:00.000Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @description Date de dernière mise à jour
             * @example 2024-01-15T10:30:00.000Z
             */
            updatedAt: string;
        };
        PaginatedDiscountsResponseDto: {
            /** @description Liste des codes promo */
            data: components["schemas"]["DiscountResponseDto"][];
            /**
             * @description Métadonnées de pagination
             * @example {
             *       "total": 50,
             *       "page": 1,
             *       "limit": 10,
             *       "totalPages": 5
             *     }
             */
            meta: Record<string, never>;
        };
        ValidateDiscountDto: {
            /**
             * @description Code promo à valider
             * @example SUMMER2024
             */
            code: string;
        };
        DiscountValidationDto: {
            /**
             * @description Code valide ou non
             * @example true
             */
            isValid: boolean;
            /**
             * @description Code promo
             * @example SUMMER2024
             */
            code: string;
            /**
             * @description Message explicatif
             * @example Code promo valide
             */
            message?: string;
            /** @description Détails du code promo si valide */
            discount?: components["schemas"]["DiscountResponseDto"];
        };
        ApplyDiscountDto: {
            /**
             * @description Code promo à appliquer
             * @example SUMMER2024
             */
            code: string;
            /**
             * @description Montant total de la commande (en TND)
             * @example 150
             */
            amount: number;
        };
        ApplyDiscountResultDto: {
            /**
             * @description Code promo appliqué
             * @example SUMMER2024
             */
            code: string;
            /**
             * @description Type de remise
             * @example PERCENTAGE
             * @enum {string}
             */
            type: "PERCENTAGE" | "FIXED";
            /**
             * @description Valeur de la remise
             * @example 20
             */
            value: number;
            /**
             * @description Montant original (avant remise)
             * @example 150
             */
            originalAmount: number;
            /**
             * @description Montant de la remise
             * @example 30
             */
            discountAmount: number;
            /**
             * @description Montant final (après remise)
             * @example 120
             */
            finalAmount: number;
            /**
             * @description Message de confirmation
             * @example Code promo appliqué avec succès ! Vous économisez 30 TND
             */
            message: string;
        };
        GenerateEmbeddingDto: {
            /**
             * @description Texte à encoder en embedding
             * @example Samsung Galaxy S24 Ultra smartphone Android 5G
             */
            text: string;
            /**
             * @description ID optionnel pour associer à un document
             * @example product-uuid-123
             */
            documentId?: string;
            /**
             * @description Type de document
             * @example PRODUCT
             * @enum {string}
             */
            documentType?: "PRODUCT" | "CATEGORY" | "FAQ" | "POLICY" | "REVIEW" | "GENERAL";
        };
        EmbeddingResponseDto: {
            /**
             * @description ID du document si fourni
             * @example product-uuid-123
             */
            documentId: string;
            /**
             * @description Embedding vectoriel encodé en base64
             * @example W3sidmFsdWUiOjAuMTIzLCJkZWYiOjB9XQ==
             */
            embedding: string;
            /**
             * @description Dimension du vecteur
             * @example 1536
             */
            dimension: number;
            /**
             * @description Modèle utilisé
             * @example text-embedding-ada-002
             */
            model: string;
            /**
             * @description Tokens utilisés
             * @example 10
             */
            usage: Record<string, never>;
        };
        SemanticSearchDto: {
            /**
             * @description Requête de recherche
             * @example smartphone bon appareil photo
             */
            query: string;
            /**
             * @description Types de documents à rechercher
             * @example [
             *       "PRODUCT"
             *     ]
             */
            documentTypes?: ("PRODUCT" | "CATEGORY" | "FAQ" | "POLICY" | "REVIEW" | "GENERAL")[];
            /**
             * @description Nombre maximum de résultats
             * @example 10
             */
            limit?: number;
            /**
             * @description Seuil de similarité minimum (0-1)
             * @example 0.5
             */
            similarityThreshold?: number;
        };
        SearchResultDto: {
            /**
             * @description ID du document
             * @example product-uuid-123
             */
            id: string;
            /**
             * @description Score de similarité cosinus
             * @example 0.85
             */
            score: number;
            /**
             * @description Type de document
             * @example PRODUCT
             * @enum {string}
             */
            documentType: "PRODUCT" | "CATEGORY" | "FAQ" | "POLICY" | "REVIEW" | "GENERAL";
            /**
             * @description Titre ou nom du document
             * @example Samsung Galaxy S24 Ultra
             */
            title?: string;
            /**
             * @description Contenu textuel
             * @example Le Samsung Galaxy S24 Ultra dispose d'un appareil photo de 200MP...
             */
            content?: string;
            /**
             * @description URL de l'image
             * @example https://example.com/image.jpg
             */
            imageUrl?: string;
            /**
             * @description Prix si applicable
             * @example 1299.99
             */
            price?: number;
            /**
             * @description Métadonnées additionnelles
             * @example {
             *       "category": "Smartphones",
             *       "brand": "Samsung"
             *     }
             */
            metadata?: Record<string, never>;
        };
        SemanticSearchResponseDto: {
            /**
             * @description Requête utilisée
             * @example smartphone bon appareil photo
             */
            query: string;
            /**
             * @description Nombre de résultats
             * @example 10
             */
            totalResults: number;
            /**
             * @description Temps de recherche en ms
             * @example 150
             */
            searchTimeMs: number;
            /** @description Résultats de recherche */
            results: components["schemas"]["SearchResultDto"][];
            /**
             * @description Modèle utilisé
             * @example text-embedding-ada-002
             */
            model: string;
        };
        ChatbotQueryDto: {
            /**
             * @description Message de l'utilisateur
             * @example Quel est le meilleur smartphone pour la photo?
             */
            message: string;
            /**
             * @description ID de session de conversation existante
             * @example session-uuid-123
             */
            sessionId?: string;
            /**
             * @description Inclure l'historique récent dans le contexte
             * @example true
             */
            includeHistory?: boolean;
            /**
             * @description Température pour la génération (0-1)
             * @example 0.7
             */
            temperature?: number;
        };
        ChatbotResponseDto: {
            /**
             * @description ID de la session
             * @example session-uuid-123
             */
            sessionId: string;
            /**
             * @description Réponse générée
             * @example Basé sur votre recherche, je vous recommande le Samsung Galaxy S24 Ultra...
             */
            answer: string;
            /**
             * @description Sources utilisées pour générer la réponse
             * @example [
             *       "product-uuid-1",
             *       "product-uuid-2"
             *     ]
             */
            sources: string[];
            /**
             * @description Temps de génération en ms
             * @example 2500
             */
            processingTimeMs: number;
            /**
             * @description Nom du modèle utilisé
             * @example gpt-3.5-turbo
             */
            model: string;
            /**
             * @description Score de confiance (0-1)
             * @example 0.92
             */
            confidenceScore?: number;
            /** @description Produits recommandés */
            recommendedProducts?: Record<string, never>[];
        };
        CreateChatSessionDto: {
            /**
             * @description Métadonnées initiales de la session
             * @example {
             *       "source": "website"
             *     }
             */
            metadata?: Record<string, never>;
        };
        ChatSessionResponseDto: {
            /**
             * @description ID de la session
             * @example session-uuid-123
             */
            id: string;
            /**
             * @description ID de l'utilisateur
             * @example user-uuid-123
             */
            userId?: string;
            /**
             * @description Messages de la conversation
             * @example [
             *       {
             *         "role": "user",
             *         "content": "Bonjour",
             *         "timestamp": "2024-01-01T10:00:00Z"
             *       },
             *       {
             *         "role": "assistant",
             *         "content": "Bonjour! Comment puis-je vous aider?",
             *         "timestamp": "2024-01-01T10:00:01Z"
             *       }
             *     ]
             */
            messages: Record<string, never>[];
            /**
             * @description Date de création
             * @example 2024-01-01T10:00:00Z
             */
            createdAt: string;
            /**
             * @description Date de dernière mise à jour
             * @example 2024-01-01T10:30:00Z
             */
            updatedAt: string;
        };
        RecommendationConfigDto: {
            /**
             * @description ID de l'utilisateur (injecté depuis le token si authentifié)
             * @example user-uuid-123
             */
            userId?: string;
            /**
             * @description Nombre de recommandations
             * @example 5
             */
            limit?: number;
            /**
             * @description Catégories à privilégier
             * @example [
             *       "category-uuid-1",
             *       "category-uuid-2"
             *     ]
             */
            preferredCategories?: unknown[][];
            /**
             * @description Prix minimum
             * @example 100
             */
            minPrice?: number;
            /**
             * @description Prix maximum
             * @example 1000
             */
            maxPrice?: number;
        };
        ProductRecommendationResponseDto: {
            /**
             * @description ID de l'utilisateur
             * @example user-uuid-123
             */
            userId: string;
            /**
             * @description Type de recommandation
             * @example similar-to-purchased
             */
            recommendationType: string;
            /** @description Produits recommandés */
            products: Record<string, never>[];
            /**
             * @description Nombre de produits recommandés
             * @example 5
             */
            totalRecommendations: number;
            /**
             * @description Métadonnées de recommandation
             * @example {
             *       "basedOnSearches": 3,
             *       "basedOnPurchases": 5,
             *       "avgSentiment": 0.75
             *     }
             */
            metadata?: Record<string, never>;
        };
        SentimentAnalysisDto: {
            /**
             * @description Texte à analyser
             * @example Excellent produit, je recommande vivement!
             */
            text: string;
            /**
             * @description Type de texte
             * @example REVIEW
             * @enum {string}
             */
            documentType?: "PRODUCT" | "CATEGORY" | "FAQ" | "POLICY" | "REVIEW" | "GENERAL";
        };
        SentimentAnalysisResponseDto: {
            /**
             * @description Score de sentiment (-1 à 1)
             * @example 0.75
             */
            score: number;
            /**
             * @description Label du sentiment
             * @example positive
             * @enum {string}
             */
            label: "positive" | "neutral" | "negative";
            /**
             * @description Confiance de l'analyse (0-1)
             * @example 0.88
             */
            confidence: number;
            /**
             * @description Mots-clés positifs détectés
             * @example [
             *       "excellent",
             *       "recommande",
             *       "qualité"
             *     ]
             */
            positiveKeywords: string[];
            /**
             * @description Mots-clés négatifs détectés
             * @example []
             */
            negativeKeywords: string[];
        };
        SEOGenerationDto: {
            /**
             * @description Titre du produit
             * @example Samsung Galaxy S24 Ultra
             */
            title: string;
            /**
             * @description Description courte du produit
             * @example Le smartphone le plus avancé de Samsung avec un appareil photo de 200MP
             */
            description: string;
            /**
             * @description Mots-clés à inclure
             * @example [
             *       "smartphone",
             *       "Samsung",
             *       "5G",
             *       "photo"
             *     ]
             */
            keywords: unknown[][];
            /**
             * @description Marque du produit
             * @example Samsung
             */
            brand?: string;
            /**
             * @description Catégorie du produit
             * @example Smartphones
             */
            category?: string;
            /**
             * @description Longueur souhaitée
             * @example medium
             * @enum {string}
             */
            targetLength?: "short" | "medium" | "long";
            /**
             * @description Ton du contenu
             * @example professional
             * @enum {string}
             */
            tone?: "professional" | "casual" | "persuasive";
        };
        SEOGenerationResponseDto: {
            /**
             * @description Titre SEO optimisé
             * @example Samsung Galaxy S24 Ultra | Smartphone 5G avec Appareil Photo 200MP
             */
            title: string;
            /**
             * @description Meta description optimisée
             * @example Découvrez le Samsung Galaxy S24 Ultra, le smartphone le plus avancé...
             */
            metaDescription: string;
            /**
             * @description Mots-clés détectés/suggérés
             * @example [
             *       "Samsung Galaxy S24 Ultra",
             *       "smartphone 5G",
             *       "appareil photo 200MP"
             *     ]
             */
            keywords: string[];
            /**
             * @description Balises H1 suggérées
             * @example Samsung Galaxy S24 Ultra - Le Roi de la Photographie Mobile
             */
            suggestedH1?: string;
            /**
             * @description Liste de mots-clés à long format
             * @example [
             *       "meilleur smartphone pour photo 2024",
             *       "Samsung Galaxy S24 Ultra caractéristiques"
             *     ]
             */
            longTailKeywords?: string[];
            /**
             * @description Description générée au format HTML
             * @example <h1>Samsung Galaxy S24 Ultra</h1><p>...</p>
             */
            htmlContent?: string;
        };
        AddKnowledgeDocumentDto: {
            /**
             * @description Contenu textuel du document
             * @example Notre politique de retour permet de retourner les produits dans les 30 jours
             */
            content: string;
            /**
             * @description Type de document
             * @example POLICY
             * @enum {string}
             */
            documentType: "PRODUCT" | "CATEGORY" | "FAQ" | "POLICY" | "REVIEW" | "GENERAL";
            /**
             * @description Titre du document
             * @example Politique de retour
             */
            title?: string;
            /**
             * @description Métadonnées additionnelles
             * @example {
             *       "section": "retour",
             *       "updatedAt": "2024-01-01"
             *     }
             */
            metadata?: Record<string, never>;
            /**
             * @description ID de référence externe
             * @example policy-return-v1
             */
            externalId?: string;
        };
        KnowledgeDocumentResponseDto: {
            /**
             * @description ID du document
             * @example doc-uuid-123
             */
            id: string;
            /**
             * @description Type de document
             * @example PRODUCT
             * @enum {string}
             */
            documentType: "PRODUCT" | "CATEGORY" | "FAQ" | "POLICY" | "REVIEW" | "GENERAL";
            /**
             * @description Titre du document
             * @example Samsung Galaxy S24 Ultra
             */
            title?: string;
            /**
             * @description Embedding généré avec succès
             * @example true
             */
            embeddingGenerated: boolean;
            /**
             * @description Date de création
             * @example 2024-01-01T10:00:00Z
             */
            createdAt: string;
        };
        IndexProductDto: {
            /**
             * @description ID du produit
             * @example product-uuid-123
             */
            productId: string;
            /**
             * @description Nom du produit
             * @example iPhone 15 Pro Max
             */
            name: string;
            /**
             * @description Description du produit
             * @example Le nouvel iPhone avec appareil photo 48MP et puce A17 Pro
             */
            description: string;
            /**
             * @description Catégorie du produit
             * @example Smartphones
             */
            category?: string;
            /**
             * @description Prix du produit
             * @example 1299.99
             */
            price?: number;
            /**
             * @description Marque du produit
             * @example Apple
             */
            brand?: string;
            /**
             * @description Tags additionnels
             * @example [
             *       "5G",
             *       "智能手机",
             *       "premium"
             *     ]
             */
            tags?: unknown[][];
        };
        KnowledgeBaseStatsResponseDto: {
            /**
             * @description Nombre total de documents
             * @example 1500
             */
            totalDocuments: number;
            /**
             * @description Nombre de documents par type
             * @example {
             *       "PRODUCT": 500,
             *       "CATEGORY": 50,
             *       "FAQ": 100,
             *       "POLICY": 20,
             *       "REVIEW": 800,
             *       "GENERAL": 30
             *     }
             */
            documentsByType: Record<string, never>;
            /**
             * @description Dimension des embeddings
             * @example 1536
             */
            embeddingDimension: number;
            /**
             * @description Dernier document indexé
             * @example 2024-01-01T12:00:00Z
             */
            lastUpdated: string;
        };
        TriggerWorkflowDto: {
            /**
             * @description Type d'événement du workflow
             * @example order_confirmed
             * @enum {string}
             */
            eventType: "order_confirmed" | "order_shipped" | "order_delivered" | "payment_success" | "payment_failed" | "low_stock" | "out_of_stock" | "abandoned_cart" | "user_registered" | "review_submitted";
            /**
             * @description Données à envoyer au workflow
             * @example {
             *       "orderId": "uuid-commande",
             *       "customerEmail": "client@example.com",
             *       "amount": 150.5
             *     }
             */
            data: Record<string, never>;
            /**
             * @description URL du webhook n8n spécifique (optionnel)
             * @example https://n8n.example.com/webhook/order-confirmation
             */
            webhookUrl?: string;
        };
        WorkflowTriggerResponseDto: {
            /**
             * @description Succès du déclenchement
             * @example true
             */
            success: boolean;
            /**
             * @description Message de réponse
             * @example Workflow déclenché avec succès
             */
            message?: string;
            /**
             * @description ID du workflow exécuté
             * @example execution-123
             */
            workflowId?: string;
        };
        OrderConfirmationDto: {
            /**
             * @description ID de la commande
             * @example uuid-commande
             */
            orderId: string;
        };
        LowStockAlertDto: {
            /**
             * @description ID du produit
             * @example uuid-produit
             */
            productId: string;
        };
        AbandonedCartDto: {
            /**
             * @description ID du panier
             * @example uuid-panier
             */
            cartId: string;
        };
        WorkflowHealthDto: {
            /**
             * @description Statut du service
             * @example operational
             */
            status: string;
            /**
             * @description Webhooks configurés
             * @example {
             *       "order": true,
             *       "payment": true,
             *       "stock": false
             *     }
             */
            webhooks: Record<string, never>;
        };
        OverviewResponseDto: {
            /**
             * @description Chiffre daffaires total
             * @example 15000.5
             */
            totalRevenue: number;
            /**
             * @description Nombre total de commandes
             * @example 150
             */
            totalOrders: number;
            /**
             * @description Nombre total de clients
             * @example 85
             */
            totalCustomers: number;
            /**
             * @description Nombre de nouveaux clients
             * @example 12
             */
            newCustomers: number;
            /**
             * @description Valeur moyenne des commandes
             * @example 100.03
             */
            avgOrderValue: number;
            /**
             * @description Nombre de produits vendus
             * @example 450
             */
            totalProductsSold: number;
            /**
             * @description Taux de conversion (commandes/visiteurs)
             * @example 3.5
             */
            conversionRate: number;
            /**
             * @description Période analysée
             * @example month
             */
            period: string;
            /**
             * Format: date-time
             * @description Date de début de la période
             */
            startDate: string;
            /**
             * Format: date-time
             * @description Date de fin de la période
             */
            endDate: string;
        };
        SalesTrendItemDto: {
            /**
             * @description Période (jour/semaine/mois)
             * @example 2024-01
             */
            period: string;
            /**
             * @description Chiffre d'affaires
             * @example 5000.75
             */
            revenue: number;
            /**
             * @description Nombre de commandes
             * @example 45
             */
            orders: number;
            /**
             * @description Nombre de clients
             * @example 30
             */
            customers: number;
            /**
             * @description Panier moyen
             * @example 111.24
             */
            avgOrderValue: number;
        };
        SalesTrendResponseDto: {
            /** @description Données de tendance */
            data: components["schemas"]["SalesTrendItemDto"][];
            /**
             * Format: date-time
             * @description Période de début
             */
            startDate: string;
            /**
             * Format: date-time
             * @description Période de fin
             */
            endDate: string;
            /**
             * @description Groupement temporel
             * @example day
             */
            groupBy: string;
            /**
             * @description Chiffre daffaires total
             * @example 50000
             */
            totalRevenue: number;
            /**
             * @description Nombre total de commandes
             * @example 450
             */
            totalOrders: number;
        };
        ProductSalesDto: {
            /** @description ID du produit */
            productId: string;
            /**
             * @description Nom du produit
             * @example Produit X
             */
            productName: string;
            /**
             * @description Prix unitaire
             * @example 99.99
             */
            price: number;
            /**
             * @description Quantité vendue
             * @example 150
             */
            quantitySold: number;
            /**
             * @description Chiffre d'affaires généré
             * @example 14998.5
             */
            revenue: number;
            /**
             * @description URL de l'image
             * @example https://example.com/image.jpg
             */
            imageUrl?: string;
            /**
             * @description Nom de la catégorie
             * @example Électronique
             */
            categoryName: string;
        };
        BestSellersResponseDto: {
            /** @description Liste des produits les plus vendus */
            data: components["schemas"]["ProductSalesDto"][];
            /**
             * @description Nombre total de produits
             * @example 10
             */
            total: number;
        };
        OrderStatusItemDto: {
            /**
             * @description Statut de commande
             * @enum {string}
             */
            status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
            /**
             * @description Nombre de commandes
             * @example 25
             */
            count: number;
            /**
             * @description Pourcentage du total
             * @example 16.67
             */
            percentage: number;
        };
        OrdersByStatusResponseDto: {
            /** @description Répartition par statut */
            data: components["schemas"]["OrderStatusItemDto"][];
            /**
             * @description Nombre total de commandes
             * @example 150
             */
            total: number;
        };
        CustomerDto: {
            /** @description ID du client */
            id: string;
            /**
             * @description Email
             * @example client@example.com
             */
            email: string;
            /**
             * @description Prénom
             * @example Mohamed
             */
            firstName?: string;
            /**
             * @description Nom
             * @example Ben Ali
             */
            lastName?: string;
            /**
             * @description Nombre de commandes
             * @example 15
             */
            ordersCount: number;
            /**
             * @description Dépenses totales
             * @example 2500.75
             */
            totalSpent: number;
            /**
             * Format: date-time
             * @description Date de la dernière commande
             */
            lastOrderDate: string;
        };
        TopCustomersResponseDto: {
            /** @description Liste des meilleurs clients */
            data: components["schemas"]["CustomerDto"][];
            /**
             * @description Nombre total de clients
             * @example 100
             */
            total: number;
        };
        CategoryRevenueDto: {
            /** @description ID de la catégorie */
            categoryId: string;
            /**
             * @description Nom de la catégorie
             * @example Électronique
             */
            categoryName: string;
            /**
             * @description Chiffre daffaires
             * @example 8500.5
             */
            revenue: number;
            /**
             * @description Nombre de ventes
             * @example 85
             */
            salesCount: number;
            /**
             * @description Pourcentage du CA total
             * @example 35.5
             */
            percentage: number;
        };
        RevenueByCategoryResponseDto: {
            /** @description CA par catégorie */
            data: components["schemas"]["CategoryRevenueDto"][];
            /**
             * @description Chiffre daffaires total
             * @example 25000
             */
            totalRevenue: number;
        };
        DashboardSummaryDto: {
            /**
             * @description Chiffre daffaires du jour
             * @example 1250.5
             */
            todayRevenue: number;
            /**
             * @description Commandes du jour
             * @example 15
             */
            todayOrders: number;
            /**
             * @description Commandes en attente
             * @example 8
             */
            pendingOrders: number;
            /**
             * @description Nouveaux clients du mois
             * @example 45
             */
            newCustomersThisMonth: number;
            /**
             * @description Produits en stock faible
             * @example 5
             */
            lowStockProducts: number;
            /**
             * @description Produits en rupture de stock
             * @example 2
             */
            outOfStockProducts: number;
        };
        RecentOrderDto: {
            /** @description ID de la commande */
            id: string;
            /**
             * @description Numéro de commande
             * @example cmd-12345
             */
            orderNumber: string;
            /**
             * @description Nom du client
             * @example Mohamed Ben Ali
             */
            customerName: string;
            /**
             * @description Email du client
             * @example client@example.com
             */
            customerEmail: string;
            /**
             * @description Montant total
             * @example 250.75
             */
            totalAmount: number;
            /**
             * @description Statut
             * @example PENDING
             */
            status: string;
            /**
             * Format: date-time
             * @description Date de création
             */
            createdAt: string;
        };
        DashboardResponseDto: {
            /** @description Résumé des KPIs */
            summary: components["schemas"]["DashboardSummaryDto"];
            /** @description Dernières commandes */
            recentOrders: components["schemas"]["RecentOrderDto"][];
            /** @description Ventes des 7 derniers jours */
            last7DaysSales: unknown[];
            /** @description Top catégories */
            topCategories: unknown[];
        };
        UserListItemDto: {
            /** @description ID de lutilisateur */
            id: string;
            /**
             * @description Email
             * @example user@example.com
             */
            email: string;
            /**
             * @description Prénom
             * @example Mohamed
             */
            firstName?: string;
            /**
             * @description Nom
             * @example Ben Ali
             */
            lastName?: string;
            /**
             * @description Rôle
             * @enum {string}
             */
            role: "USER" | "ADMIN";
            /**
             * @description Nombre de commandes
             * @example 12
             */
            ordersCount: number;
            /**
             * @description Dépenses totales
             * @example 1500.5
             */
            totalSpent: number;
            /**
             * Format: date-time
             * @description Date dinscription
             */
            createdAt: string;
            /**
             * Format: date-time
             * @description Dernière connexion
             */
            lastLoginAt?: string;
        };
        UsersListResponseDto: {
            /** @description Liste des utilisateurs */
            data: components["schemas"]["UserListItemDto"][];
            /**
             * @description Nombre total
             * @example 500
             */
            total: number;
            /**
             * @description Page actuelle
             * @example 1
             */
            page: number;
            /**
             * @description Limite par page
             * @example 20
             */
            limit: number;
            /**
             * @description Nombre total de pages
             * @example 25
             */
            totalPages: number;
        };
        ProductListItemDto: {
            /** @description ID du produit */
            id: string;
            /**
             * @description Nom du produit
             * @example Produit X
             */
            name: string;
            /**
             * @description SKU
             * @example PROD-001
             */
            sku: string;
            /**
             * @description Prix
             * @example 99.99
             */
            price: number;
            /**
             * @description Stock actuel
             * @example 50
             */
            stock: number;
            /**
             * @description Statut actif
             * @example true
             */
            isActive: boolean;
            /**
             * @description Nom de la catégorie
             * @example Électronique
             */
            categoryName: string;
            /**
             * @description Nombre de ventes
             * @example 120
             */
            salesCount: number;
            /**
             * Format: date-time
             * @description Date de création
             */
            createdAt: string;
        };
        ProductsListResponseDto: {
            /** @description Liste des produits */
            data: components["schemas"]["ProductListItemDto"][];
            /**
             * @description Nombre total
             * @example 250
             */
            total: number;
            /**
             * @description Page actuelle
             * @example 1
             */
            page: number;
            /**
             * @description Limite par page
             * @example 20
             */
            limit: number;
            /**
             * @description Nombre total de pages
             * @example 13
             */
            totalPages: number;
        };
        StockAlertDto: {
            /** @description ID du produit */
            productId: string;
            /**
             * @description Nom du produit
             * @example Produit X
             */
            productName: string;
            /**
             * @description SKU
             * @example PROD-001
             */
            sku: string;
            /**
             * @description Stock actuel
             * @example 3
             */
            currentStock: number;
            /**
             * @description Seuil dalerte
             * @example 10
             */
            alertThreshold: number;
            /**
             * @description Statut
             * @enum {string}
             */
            status: "LOW_STOCK" | "OUT_OF_STOCK";
        };
        StockAlertsResponseDto: {
            /** @description Alertes de stock */
            alerts: components["schemas"]["StockAlertDto"][];
            /**
             * @description Nombre total dalertes
             * @example 7
             */
            total: number;
        };
        OrderListItemDto: {
            /** @description ID de la commande */
            id: string;
            /**
             * @description Numéro de commande
             * @example cmd-12345
             */
            orderNumber: string;
            /**
             * @description Nom du client
             * @example Mohamed Ben Ali
             */
            customerName: string;
            /**
             * @description Email du client
             * @example client@example.com
             */
            customerEmail: string;
            /**
             * @description Nombre darticles
             * @example 3
             */
            itemsCount: number;
            /**
             * @description Montant total
             * @example 250.75
             */
            totalAmount: number;
            /**
             * @description Statut
             * @enum {string}
             */
            status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
            /**
             * Format: date-time
             * @description Date de création
             */
            createdAt: string;
        };
        OrdersListResponseDto: {
            /** @description Liste des commandes */
            data: components["schemas"]["OrderListItemDto"][];
            /**
             * @description Nombre total
             * @example 1500
             */
            total: number;
            /**
             * @description Page actuelle
             * @example 1
             */
            page: number;
            /**
             * @description Limite par page
             * @example 20
             */
            limit: number;
            /**
             * @description Nombre total de pages
             * @example 75
             */
            totalPages: number;
        };
        WishlistItemResponseDto: {
            /** @description ID de lélément */
            id: string;
            /** @description ID du produit */
            productId: string;
            /** @description Nom du produit */
            productName: string;
            /** @description Prix du produit */
            price: number;
            /** @description URL de limage */
            imageUrl?: string;
            /** @description Produit actif */
            isActive: boolean;
            /**
             * Format: date-time
             * @description Date dajout
             */
            createdAt: string;
        };
        WishlistResponseDto: {
            /** @description ID de la wishlist */
            id: string;
            /** @description ID de lutilisateur */
            userId: string;
            /** @description Nombre déléments */
            itemCount: number;
            /** @description Éléments de la wishlist */
            items: components["schemas"]["WishlistItemResponseDto"][];
            /**
             * Format: date-time
             * @description Date de création
             */
            createdAt: string;
            /**
             * Format: date-time
             * @description Date de mise à jour
             */
            updatedAt: string;
        };
        AddToWishlistDto: {
            /** @description ID du produit à ajouter */
            productId: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AppController_getHello: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterDto"];
            };
        };
        responses: {
            /** @description User successfully registered */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthResponseDto"];
                };
            };
            /** @description Bad Request. Validation failed or user already exists */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Too Many Requests. Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_refresh: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description New access token generated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthResponseDto"];
                };
            };
            /** @description Unauthorized. Invalid or expired refresh token */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Too Many Requests. Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User successfully logged out */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized. Invalid or expired access token */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Too Many Requests. Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginDto"];
            };
        };
        responses: {
            /** @description User successfully logged in */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthResponseDto"];
                };
            };
            /** @description Unauthorized. Invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Too Many Requests. Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_getProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The current user profile */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDto"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_deleteAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User account deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserDto"];
            };
        };
        responses: {
            /** @description The updated user profile */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDto"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Email already in use */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of all users */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDto"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The user with the specified ID */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDto"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_deleteUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User with the specified ID deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_changePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordDto"];
            };
        };
        responses: {
            /** @description Password changed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoryController_findAll: {
        parameters: {
            query?: {
                /** @description Filter by active status */
                isActive?: boolean;
                /** @description Search term to filter categories by name or description */
                search?: string;
                /** @description Page number for pagination */
                page?: components["schemas"]["Object"];
                /** @description Number of items per page for pagination */
                limit?: components["schemas"]["Object"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of categories retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["CategoryResponseDto"][];
                        meta?: {
                            total?: number;
                            page?: number;
                            limit?: number;
                            totalPages?: number;
                        };
                    };
                };
            };
        };
    };
    CategoryController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCategoryDto"];
            };
        };
        responses: {
            /** @description Category created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid input data. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoryController_findBySlug: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Category details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryResponseDto"];
                };
            };
            /** @description Category not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoryController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Category details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryResponseDto"];
                };
            };
            /** @description Category not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoryController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cannot delete category with products */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoryController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCategoryDto"];
            };
        };
        responses: {
            /** @description category updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryResponseDto"];
                };
            };
            /** @description Category not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Category slug already */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_findAll: {
        parameters: {
            query?: {
                /** @description Filter by category */
                category?: string;
                /** @description Filter by active status */
                isActive?: boolean;
                /** @description Search by product name */
                search?: string;
                /** @description Page number for pagination */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of products with pagination */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["ProductResponseDto"][];
                        meta?: {
                            total?: number;
                            page?: number;
                            limit?: number;
                            totalPages?: number;
                        };
                    };
                };
            };
        };
    };
    ProductsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProductDto"];
            };
        };
        responses: {
            /** @description Product created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResponseDto"];
                };
            };
            /** @description Forbidden - Admin role required */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sku already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Product details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResponseDto"];
                };
            };
            /** @description Product not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Product deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cannot delete product in active orders */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Product not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProductDto"];
            };
        };
        responses: {
            /** @description Product updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResponseDto"];
                };
            };
            /** @description Product not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description SKu already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_updateStock: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Stock adjustment ( positive to add, negative to subtract)
                     * @example 10
                     */
                    quantity: number;
                };
            };
        };
        responses: {
            /** @description Stock updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResponseDto"];
                };
            };
            /** @description Insufficient stock */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Product not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    OrdersController_findAll: {
        parameters: {
            query?: {
                limit?: number;
                page?: number;
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of user orders */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedOrderResponseDto"];
                };
            };
        };
    };
    OrdersController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateOrderDto"];
            };
        };
        responses: {
            /** @description Order created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderApiResponseDto"];
                };
            };
            /** @description Invalid data or insufficient stock */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cart not found or empty */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Too many requests - rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    OrdersController_findAllForAdmin: {
        parameters: {
            query?: {
                limit?: number;
                page?: number;
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Admin access required */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description List of orders */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["OrderResponseDto"][];
                        total?: number;
                        page?: number;
                        limit?: number;
                    };
                };
            };
        };
    };
    OrdersController_findOneAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Order ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Order details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderApiResponseDto"];
                };
            };
            /** @description Admin access required */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Order not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    OrdersController_cancelAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Order ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Order cancelled! */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderApiResponseDto"];
                };
            };
            /** @description Order not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    OrdersController_updateAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Order ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrderDto"];
            };
        };
        responses: {
            /** @description Order update successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderApiResponseDto"];
                };
            };
            /** @description Admin access required */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Order not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    OrdersController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Order ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Order details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderApiResponseDto"];
                };
            };
            /** @description Order not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    OrdersController_cancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Order ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Order cancelled! */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderApiResponseDto"];
                };
            };
            /** @description Order not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    OrdersController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Order ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrderDto"];
            };
        };
        responses: {
            /** @description Order updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Order not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    FlouciController_initiatePayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InitiatePaymentDto"];
            };
        };
        responses: {
            /** @description Paiement initié avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentInitiationResponseDto"];
                };
            };
            /** @description Données invalides */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Commande non trouvée */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    FlouciController_handleWebhook: {
        parameters: {
            query?: never;
            header: {
                "x-flouci-signature": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Object"];
            };
        };
        responses: {
            /** @description Webhook traité */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookResponseDto"];
                };
            };
        };
    };
    FlouciController_verifyPayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerifyPaymentDto"];
            };
        };
        responses: {
            /** @description Statut du paiement */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentVerificationResponseDto"];
                };
            };
        };
    };
    FlouciController_getPaymentStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de la commande */
                orderId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statut du paiement */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentStatusResponseDto"];
                };
            };
        };
    };
    FlouciController_cancelPayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description ID de tracking du paiement
                     * @example order-uuid-timestamp-random
                     */
                    trackingId: string;
                };
            };
        };
        responses: {
            /** @description Paiement annulé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    FlouciController_simulateTestPayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TestWalletPaymentDto"];
            };
        };
        responses: {
            /** @description Paiement simulé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentInitiationResponseDto"];
                };
            };
        };
    };
    FlouciController_getTestConfig: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Configuration du mode test */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestModeConfigResponseDto"];
                };
            };
        };
    };
    FlouciController_getPaymentStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques des paiements */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    FlouciController_getPayments: {
        parameters: {
            query: {
                page: number;
                limit: number;
                status: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste des paiements */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    FlouciController_getPaymentDetail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Détail du paiement */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    FlouciController_refundPayment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Remboursement effectué */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    FlouciController_getConfig: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Configuration actuelle */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    FlouciController_getPaymentTrends: {
        parameters: {
            query: {
                period: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tendance */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CartsController_getCart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Panier récupéré avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CartsController_clearCart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Panier vidé */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CartsController_getCartCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Nombre d'items récupéré */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CartsController_addToCart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddToCartDto"];
            };
        };
        responses: {
            /** @description Produit ajouté au panier */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Stock insuffisant */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Produit non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CartsController_updateCartItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de l'item du panier */
                cartItemId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCartDto"];
            };
        };
        responses: {
            /** @description Item du panier mis à jour */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Item du panier non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CartsController_removeCartItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de l'item du panier */
                cartItemId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Item du panier supprimé */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Item du panier non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CartsController_validateCart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Validation du panier */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CartsController_checkout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CheckoutDto"];
            };
        };
        responses: {
            /** @description Commande créée avec succès */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Panier invalide ou vide */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateReviewDto"];
            };
        };
        responses: {
            /** @description Avis créé avec succès */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewResponseDto"];
                };
            };
            /** @description Avis déjà existant pour ce produit */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description L'utilisateur n'a pas acheté ce produit */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Produit non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_findByProduct: {
        parameters: {
            query?: {
                /** @description Numéro de page */
                page?: number;
                /** @description Nombre d'éléments par page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description ID du produit */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste des avis avec pagination */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedReviewsResponseDto"];
                };
            };
            /** @description Produit non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_getProductRatingSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du produit */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Résumé des notes */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductRatingSummaryDto"];
                };
            };
        };
    };
    ReviewsController_findMyReviews: {
        parameters: {
            query?: {
                /** @description Numéro de page */
                page?: number;
                /** @description Nombre d'éléments par page */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste de mes avis */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedReviewsResponseDto"];
                };
            };
        };
    };
    ReviewsController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de l'avis */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Détails de l'avis */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewResponseDto"];
                };
            };
            /** @description Avis non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de l'avis */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Avis supprimé avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Vous ne pouvez supprimer que vos propres avis */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Avis non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de l'avis */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateReviewDto"];
            };
        };
        responses: {
            /** @description Avis mis à jour */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewResponseDto"];
                };
            };
            /** @description Vous ne pouvez modifier que vos propres avis */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Avis non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_canReview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du produit */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Résultat de la vérification */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        canReview?: boolean;
                        hasPurchased?: boolean;
                        hasReviewed?: boolean;
                        message?: string;
                    };
                };
            };
        };
    };
    ReviewsController_findAllForAdmin: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
                status?: "all" | "pending" | "approved" | "hidden";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste de tous les avis */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedReviewsResponseDto"];
                };
            };
        };
    };
    ReviewsController_hideReview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de lavis */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Avis masqué */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewResponseDto"];
                };
            };
        };
    };
    ReviewsController_approveReview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de lavis */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Avis approuvé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewResponseDto"];
                };
            };
        };
    };
    ReviewsController_deleteReviewAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de lavis */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Avis supprimé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_getStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques des avis */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DiscountsController_findAll: {
        parameters: {
            query?: {
                /** @description Numéro de page */
                page?: number;
                /** @description Nombre d'éléments par page */
                limit?: number;
                /** @description Filtrer par statut actif */
                isActive?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste des codes promo */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedDiscountsResponseDto"];
                };
            };
        };
    };
    DiscountsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateDiscountDto"];
            };
        };
        responses: {
            /** @description Code promo créé avec succès */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscountResponseDto"];
                };
            };
            /** @description Code promo déjà existant */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DiscountsController_getStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DiscountsController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du code promo */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Détails du code promo */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscountResponseDto"];
                };
            };
            /** @description Code promo non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DiscountsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du code promo */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Code promo supprimé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Code promo non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DiscountsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du code promo */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateDiscountDto"];
            };
        };
        responses: {
            /** @description Code promo mis à jour */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscountResponseDto"];
                };
            };
            /** @description Code promo non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DiscountsController_activate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du code promo */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Code promo activé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscountResponseDto"];
                };
            };
        };
    };
    DiscountsController_deactivate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du code promo */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Code promo désactivé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscountResponseDto"];
                };
            };
        };
    };
    DiscountsController_validate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ValidateDiscountDto"];
            };
        };
        responses: {
            /** @description Résultat de la validation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscountValidationDto"];
                };
            };
        };
    };
    DiscountsController_apply: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApplyDiscountDto"];
            };
        };
        responses: {
            /** @description Résultat de l'application */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApplyDiscountResultDto"];
                };
            };
            /** @description Code promo invalide ou conditions non remplies */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AiController_generateEmbedding: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateEmbeddingDto"];
            };
        };
        responses: {
            /** @description Embedding généré avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmbeddingResponseDto"];
                };
            };
            /** @description Erreur lors de la génération de l'embedding */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AiController_semanticSearch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SemanticSearchDto"];
            };
        };
        responses: {
            /** @description Résultats de recherche */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SemanticSearchResponseDto"];
                };
            };
        };
    };
    AiController_chatbot: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChatbotQueryDto"];
            };
        };
        responses: {
            /** @description Réponse du chatbot */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatbotResponseDto"];
                };
            };
        };
    };
    AiController_createChatSession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateChatSessionDto"];
            };
        };
        responses: {
            /** @description Session créée */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatSessionResponseDto"];
                };
            };
        };
    };
    AiController_getRecommendations: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecommendationConfigDto"];
            };
        };
        responses: {
            /** @description Produits recommandés */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductRecommendationResponseDto"];
                };
            };
        };
    };
    AiController_analyzeSentiment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SentimentAnalysisDto"];
            };
        };
        responses: {
            /** @description Résultat de lanalyse */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SentimentAnalysisResponseDto"];
                };
            };
        };
    };
    AiController_generateSEO: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SEOGenerationDto"];
            };
        };
        responses: {
            /** @description Optimisation SEO générée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SEOGenerationResponseDto"];
                };
            };
        };
    };
    AiController_addKnowledgeDocument: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddKnowledgeDocumentDto"];
            };
        };
        responses: {
            /** @description Document ajouté */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["KnowledgeDocumentResponseDto"];
                };
            };
        };
    };
    AiController_indexProduct: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["IndexProductDto"];
            };
        };
        responses: {
            /** @description Produit indexé */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["KnowledgeDocumentResponseDto"];
                };
            };
        };
    };
    AiController_getKnowledgeBaseStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["KnowledgeBaseStatsResponseDto"];
                };
            };
        };
    };
    AiController_searchSimilarProducts: {
        parameters: {
            query: {
                /** @description Requête de recherche */
                query: string;
                /** @description Nombre maximum de résultats */
                limit?: number;
                /** @description Prix minimum */
                minPrice?: number;
                /** @description Prix maximum */
                maxPrice?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Produits similaires trouvés */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        query?: string;
                        totalResults?: number;
                        results?: {
                            productId?: string;
                            name?: string;
                            description?: string;
                            price?: number;
                            imageUrl?: string;
                            categoryName?: string;
                            similarityScore?: number;
                        }[];
                    };
                };
            };
        };
    };
    AiController_healthCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Service opérationnel */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WorkflowsController_triggerWorkflow: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TriggerWorkflowDto"];
            };
        };
        responses: {
            /** @description Workflow déclenché */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowTriggerResponseDto"];
                };
            };
        };
    };
    WorkflowsController_confirmOrder: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OrderConfirmationDto"];
            };
        };
        responses: {
            /** @description Confirmation de commande envoyée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowTriggerResponseDto"];
                };
            };
            /** @description Commande non trouvée */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WorkflowsController_triggerLowStock: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LowStockAlertDto"];
            };
        };
        responses: {
            /** @description Alerte de stock envoyée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowTriggerResponseDto"];
                };
            };
            /** @description Produit non trouvé */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WorkflowsController_checkAllStock: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Vérification terminée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WorkflowsController_triggerAbandonedCart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbandonedCartDto"];
            };
        };
        responses: {
            /** @description Notification envoyée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowTriggerResponseDto"];
                };
            };
        };
    };
    WorkflowsController_checkAbandonedCarts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Notifications terminées */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WorkflowsController_healthCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statut du service */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowHealthDto"];
                };
            };
        };
    };
    WorkflowsController_getEventTypes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Types dévénements */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": ("order_confirmed" | "order_shipped" | "order_delivered" | "payment_success" | "payment_failed" | "low_stock" | "out_of_stock" | "abandoned_cart" | "user_registered" | "review_submitted")[];
                };
            };
        };
    };
    WorkflowsController_getWorkflowHistory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Historique des exécutions */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WorkflowsController_getWorkflowStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WorkflowsController_getWebhooksConfig: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Webhooks configurés */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WorkflowsController_testWebhook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                name: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Test réussi */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnalyticsController_getOverview: {
        parameters: {
            query?: {
                /** @description Période danalyse */
                period?: "day" | "week" | "month" | "year";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description KPIs récupérés avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OverviewResponseDto"];
                };
            };
            /** @description Non autorisé */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Accès admin requis */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnalyticsController_getSalesTrend: {
        parameters: {
            query?: {
                /** @description Date de début (ISO 8601) */
                startDate?: string;
                /** @description Date de fin (ISO 8601) */
                endDate?: string;
                /** @description Groupement temporel */
                groupBy?: "day" | "week" | "month";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tendance des ventes récupérée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SalesTrendResponseDto"];
                };
            };
        };
    };
    AnalyticsController_getBestSellers: {
        parameters: {
            query?: {
                /** @description Nombre de résultats */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste des meilleurs ventes */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BestSellersResponseDto"];
                };
            };
        };
    };
    AnalyticsController_getOrdersByStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Répartition récupérée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrdersByStatusResponseDto"];
                };
            };
        };
    };
    AnalyticsController_getTopCustomers: {
        parameters: {
            query?: {
                /** @description Nombre de résultats */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Top clients récupéré */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TopCustomersResponseDto"];
                };
            };
        };
    };
    AnalyticsController_getRevenueByCategory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CA par catégorie récupéré */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RevenueByCategoryResponseDto"];
                };
            };
        };
    };
    AnalyticsController_getDashboard: {
        parameters: {
            query: {
                period: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dashboard complet */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        overview?: components["schemas"]["OverviewResponseDto"];
                        ordersByStatus?: components["schemas"]["OrdersByStatusResponseDto"];
                        bestSellers?: components["schemas"]["BestSellersResponseDto"];
                        revenueByCategory?: components["schemas"]["RevenueByCategoryResponseDto"];
                    };
                };
            };
        };
    };
    AdminController_getDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dashboard récupéré avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DashboardResponseDto"];
                };
            };
        };
    };
    AdminController_getUserStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques récupérées */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AdminController_getUsers: {
        parameters: {
            query?: {
                /** @description Terme de recherche (email, nom) */
                search?: string;
                /** @description Filtre par rôle (USER, ADMIN, ALL) */
                role?: string;
                /** @description Page */
                page?: number;
                /** @description Limite */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste des utilisateurs */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsersListResponseDto"];
                };
            };
        };
    };
    AdminController_banUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de lutilisateur */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Utilisateur banni avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Impossible de bannir un administrateur */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Utilisateur non trouvé */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AdminController_getProductStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques récupérées */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AdminController_getProducts: {
        parameters: {
            query?: {
                /** @description Terme de recherche (nom, SKU) */
                search?: string;
                /** @description Filtre par catégorie */
                categoryId?: string;
                /** @description Filtre par statut (true, false) */
                isActive?: string;
                /** @description Page */
                page?: number;
                /** @description Limite */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste des produits */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductsListResponseDto"];
                };
            };
        };
    };
    AdminController_getStockAlerts: {
        parameters: {
            query?: {
                /** @description Seuil dalerte (défaut: 10) */
                threshold?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Alertes de stock */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StockAlertsResponseDto"];
                };
            };
        };
    };
    AdminController_getOrderStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques récupérées */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrdersListResponseDto"];
                };
            };
        };
    };
    AdminController_getOrders: {
        parameters: {
            query?: {
                /** @description Terme de recherche (n° commande, email) */
                search?: string;
                /** @description Filtre par statut (PENDING, SHIPPED, etc.) */
                status?: string;
                /** @description Page */
                page?: number;
                /** @description Limite */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste des commandes */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrdersListResponseDto"];
                };
            };
        };
    };
    AdminController_healthCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Services opérationnels */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AdminController_getRecentActivity: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Activités récentes */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GdprController_exportData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Données exportées avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GdprController_getDataSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Résumé des données */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GdprController_updateData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example nouvel.email@example.com */
                    email?: string;
                    /** @example Jean */
                    firstName?: string;
                    /** @example Dupont */
                    lastName?: string;
                };
            };
        };
        responses: {
            /** @description Données mises à jour */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GdprController_deleteAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Compte supprimé avec succès */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Des commandes sont en cours */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GdprController_getGdprInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Informations RGPD */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CacheController_getStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques récupérées */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CacheController_exists: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Clé à vérifier */
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Résultat de la vérification */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        key?: string;
                        exists?: boolean;
                    };
                };
            };
        };
    };
    CacheController_delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Clé à supprimer */
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Clé supprimée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CacheController_deleteByPattern: {
        parameters: {
            query: {
                /** @description Pattern (ex: product:*, user:*) */
                pattern: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cache vidé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CacheController_flush: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cache vidé complètement */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CacheController_getKeys: {
        parameters: {
            query?: {
                /** @description Pattern de recherche */
                pattern?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Liste des clés */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ImagesController_uploadImage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Fichier image (JPEG, PNG, WebP, GIF)
                     */
                    file?: string;
                };
            };
        };
        responses: {
            /** @description Image uploadée avec succès */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Fichier invalide ou trop volumineux */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ImagesController_deleteImage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Nom du fichier image */
                filename: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Image supprimée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WishlistController_getWishlist: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Wishlist récupérée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WishlistResponseDto"];
                };
            };
        };
    };
    WishlistController_clearWishlist: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Wishlist vidée */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WishlistController_addItem: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddToWishlistDto"];
            };
        };
        responses: {
            /** @description Produit ajouté à la wishlist */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Produit déjà dans la wishlist */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WishlistController_removeItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de lélément dans la wishlist */
                itemId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Produit retiré */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WishlistController_removeProduct: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du produit */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Produit retiré */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WishlistController_checkProduct: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID du produit à vérifier */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Résultat de la vérification */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        productId?: string;
                        isInWishlist?: boolean;
                    };
                };
            };
        };
    };
    SearchHistoryController_logSearch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example chaussures sport */
                    query: string;
                    /** @example 25 */
                    resultsCount: number;
                    clickedProductId?: string;
                };
            };
        };
        responses: {
            /** @description Recherche enregistrée */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SearchHistoryController_getHistory: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Historique des recherches */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SearchHistoryController_getPopularSearches: {
        parameters: {
            query?: {
                limit?: number;
                period?: "day" | "week" | "month";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Recherches populaires */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SearchHistoryController_getTrends: {
        parameters: {
            query: {
                userId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tendances */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SearchHistoryController_cleanup: {
        parameters: {
            query?: {
                days?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Historique nettoyé */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatFeedbackController_submitFeedback: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example session-123 */
                    sessionId: string;
                    /** @example 5 */
                    rating: number;
                    /** @example Très utile ! */
                    comment?: string;
                    /** @example true */
                    helpful?: boolean;
                };
            };
        };
        responses: {
            /** @description Feedback soumis */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatFeedbackController_getStats: {
        parameters: {
            query?: {
                period?: "day" | "week" | "month";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Statistiques */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatFeedbackController_getTrends: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tendances sur 7 jours */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatFeedbackController_getRecent: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Feedbacks récents */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatFeedbackController_getImprovements: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Commentaires négatifs */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
