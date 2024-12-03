export interface ParkingSlot {
    _id?: string;
    id?: string;
    distance?: number;
    neighborhood_id: string;
    provider_id?: string;
    name: string;
    address: string;
    slot_status?: "active" | "inactive";
    guide_map_url?: string;
    availableTime?: string;
    new_coordinates: [number, number];
    proof_image: string;
    price_per_hour: number;
    start_time?: string;
    end_time?: string;
    dateRange: string[];
    timeRange: string[];
}

export interface Neighborhood {
    _id: string;
    name: string;
    distance: number;
}

export interface Order {
    _id: string;
    user_id: string;
    slot_id: string;
    total_price: number;
    name: string;
    availableTime: string;
    start_time: string;
    end_time: string;
    createdAt: string;
    updatedAt: string;
    status: number;
}