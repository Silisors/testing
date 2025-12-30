export interface ProductOffer {
    id: string;
    title: string;
    price: number;
    currency: string; // 'COP'
    store: string;
    url: string;
    image: string;
    description?: string;
    rating?: number;
    deliveryInfo?: string; // 'Envío gratis', 'Llega mañana', etc.
    warranty?: string;
    paymentOptions?: string[]; // e.g. ["Crédito", "Cuotas"]
    isBestOffer?: boolean;
    condition?: string; // 'Nuevo', 'Usado'
    tags?: string[];
}

export interface SearchAgentResult {
    queryUsed: string;
    offers: ProductOffer[];
    summary: string; // AI generated summary of the deals
}
