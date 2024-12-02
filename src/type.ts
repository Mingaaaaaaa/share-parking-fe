export interface ParkingSlot {
    _id: string;
    id: string;
    distance: number;
    neighborhood_id: string;
    provider_id: string;
    name: string;
    address: string;
    price_per_hour: number;
    slot_status: "active" | "inactive";
    guide_map_url: string;
    availableTime: string;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    new_coordinates: [number, number];
    timeArray: [string, string];
    timeRange: {
        start: string;
        end: string;
    };
    proof_image: string;
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
    createdAt: string;
    updatedAt: string;
}