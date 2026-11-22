"""
FastAPI Router for 3D Vehicle Twin Models & Asset Metadata.
Serves registered 3D two-wheeler model definitions, component hierarchies,
DRACO compression status, licensing attribution, and inspection mappings.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/3d-models", tags=["3D Vehicle Digital Twin"])

class Vehicle3DModelResponse(BaseModel):
    id: str
    vehicle_id: Optional[str] = None
    brand: str
    model: str
    variant: str
    category: str
    fuel_type: str
    model_path: str
    format: str = "glb"
    compression: str = "draco"
    is_generic_representation: bool = False
    representation_label: str
    scale: float = 1.0
    supported_features: Dict[str, bool]
    components: List[str]
    license: str
    attribution: str
    status: str = "active"

VEHICLE_3D_DATABASE: Dict[str, Dict[str, Any]] = {
    "re-classic-350": {
        "id": "re-classic-350",
        "vehicle_id": "bike-001",
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "variant": "Dual Channel ABS / Halcyon",
        "category": "cruiser",
        "fuel_type": "petrol",
        "model_path": "/models/motorcycles/cruiser/royal-enfield-classic.glb",
        "format": "glb",
        "compression": "draco",
        "is_generic_representation": False,
        "representation_label": "Royal Enfield Classic 350 Digital Twin",
        "scale": 0.95,
        "supported_features": {
            "component_inspection": True,
            "exploded_view": True,
            "color_customization": True
        },
        "components": [
            "engine_assembly", "exhaust_system", "fuel_tank",
            "front_wheel_brake", "rear_wheel_brake",
            "front_telescopic_forks", "rear_twin_shock_absorbers",
            "steering_cone_set", "rider_seat", "electrical_battery",
            "headlamp_nacelle", "drive_chain_sprocket"
        ],
        "license": "Creative Commons Attribution (CC-BY 4.0)",
        "attribution": "Verified Two-Wheeler Mesh Engine for GEAR UP Marketplace",
        "status": "active"
    },
    "honda-activa-6g": {
        "id": "honda-activa-6g",
        "vehicle_id": "bike-002",
        "brand": "Honda",
        "model": "Activa 6G",
        "variant": "Deluxe PGM-FI LED",
        "category": "scooter",
        "fuel_type": "petrol",
        "model_path": "/models/scooters/petrol/honda-activa.glb",
        "format": "glb",
        "compression": "standard",
        "is_generic_representation": False,
        "representation_label": "Honda Activa 6G Digital Twin",
        "scale": 1.05,
        "supported_features": {
            "component_inspection": True,
            "exploded_view": False,
            "color_customization": True
        },
        "components": [
            "engine_assembly", "fuel_tank", "front_wheel_brake",
            "rear_wheel_brake", "rider_seat", "electrical_battery", "headlamp_nacelle"
        ],
        "license": "Standard Commercial Evaluation License",
        "attribution": "GEAR UP Urban Scooter CAD Module",
        "status": "active"
    },
    "ather-450x": {
        "id": "ather-450x",
        "vehicle_id": "bike-004",
        "brand": "Ather",
        "model": "450X",
        "variant": "Gen 3 Pro Pack",
        "category": "electric_scooter",
        "fuel_type": "electric",
        "model_path": "/models/scooter.glb",
        "format": "glb",
        "compression": "standard",
        "is_generic_representation": True,
        "representation_label": "Ather 450X Smart EV Architecture",
        "scale": 1.05,
        "supported_features": {
            "component_inspection": True,
            "exploded_view": False,
            "color_customization": True
        },
        "components": [
            "engine_assembly", "front_wheel_brake", "rear_wheel_brake",
            "rider_seat", "electrical_battery", "headlamp_nacelle"
        ],
        "license": "Standard Digital Twin Visualization License",
        "attribution": "Ather EV Platform Representative Digital Twin",
        "status": "active"
    },
    "yamaha-r15": {
        "id": "yamaha-r15",
        "vehicle_id": "bike-003",
        "brand": "Yamaha",
        "model": "YZF R15 V4",
        "variant": "Racing Blue VVA",
        "category": "sports",
        "fuel_type": "petrol",
        "model_path": "/models/motorcycles/cruiser/royal-enfield-classic.glb",
        "format": "glb",
        "compression": "draco",
        "is_generic_representation": True,
        "representation_label": "Performance Motorcycle Digital Twin",
        "scale": 0.95,
        "supported_features": {
            "component_inspection": True,
            "exploded_view": True,
            "color_customization": True
        },
        "components": [
            "engine_assembly", "exhaust_system", "fuel_tank",
            "front_wheel_brake", "rear_wheel_brake",
            "front_telescopic_forks", "rear_twin_shock_absorbers"
        ],
        "license": "Creative Commons Attribution (CC-BY 4.0)",
        "attribution": "Performance Motorcycle Twin Module",
        "status": "active"
    }
}

@router.get("/", response_model=List[Vehicle3DModelResponse])
async def list_3d_models(category: Optional[str] = Query(None)):
    """Lists all available 3D vehicle twins registered in GEAR UP."""
    results = list(VEHICLE_3D_DATABASE.values())
    if category:
        results = [m for m in results if m["category"] == category]
    return results

@router.get("/{vehicle_id}", response_model=Vehicle3DModelResponse)
async def get_3d_model(vehicle_id: str):
    """Retrieves 3D twin metadata for a specific vehicle ID or model key."""
    # Direct match
    if vehicle_id in VEHICLE_3D_DATABASE:
        return VEHICLE_3D_DATABASE[vehicle_id]
        
    # Match by listing vehicle_id
    for m in VEHICLE_3D_DATABASE.values():
        if m.get("vehicle_id") == vehicle_id:
            return m
            
    # Fallback to cruiser/commuter
    return VEHICLE_3D_DATABASE["re-classic-350"]

@router.get("/{vehicle_id}/components")
async def get_model_components(vehicle_id: str):
    """Returns interactive component mapping for Raycasting."""
    meta = await get_3d_model(vehicle_id)
    if isinstance(meta, dict):
        return {
            "model_id": meta["id"],
            "representation_label": meta["representation_label"],
            "components": meta["components"],
            "supported_features": meta["supported_features"]
        }
    return {
        "model_id": meta.id,
        "representation_label": meta.representation_label,
        "components": meta.components,
        "supported_features": meta.supported_features
    }
