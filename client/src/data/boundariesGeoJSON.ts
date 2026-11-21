// ==============================================================================
// Administrative Boundaries GeoJSON Dataset for Indian Hubs
// Provides district, city, and state boundary lines over satellite maps
// ==============================================================================

export interface BoundaryFeature {
  type: 'Feature';
  properties: {
    name: string;
    level: 'state' | 'district' | 'city' | 'sector_cluster';
    state: string;
    center: [number, number];
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [lng, lat]
  };
}

export const INDIAN_BOUNDARIES_GEOJSON: { type: 'FeatureCollection'; features: BoundaryFeature[] } = {
  type: 'FeatureCollection',
  features: [
    // 1. Chandigarh Union Territory Boundary
    {
      type: 'Feature',
      properties: {
        name: 'Chandigarh (UT)',
        level: 'city',
        state: 'Chandigarh',
        center: [30.7333, 76.7794],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.720, 30.760],
            [76.755, 30.785],
            [76.815, 30.780],
            [76.835, 30.750],
            [76.830, 30.710],
            [76.780, 30.685],
            [76.735, 30.700],
            [76.710, 30.730],
            [76.720, 30.760],
          ],
        ],
      },
    },

    // 2. Mohali (SAS Nagar, Punjab) District Boundary
    {
      type: 'Feature',
      properties: {
        name: 'Mohali / SAS Nagar (Punjab)',
        level: 'district',
        state: 'Punjab',
        center: [30.7046, 76.7179],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.650, 30.750],
            [76.710, 30.730],
            [76.735, 30.700],
            [76.720, 30.650],
            [76.660, 30.630],
            [76.620, 30.680],
            [76.650, 30.750],
          ],
        ],
      },
    },

    // 3. Panchkula (Haryana) District Boundary
    {
      type: 'Feature',
      properties: {
        name: 'Panchkula (Haryana)',
        level: 'district',
        state: 'Haryana',
        center: [30.6942, 76.8606],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.835, 30.750],
            [76.885, 30.765],
            [76.920, 30.720],
            [76.890, 30.660],
            [76.830, 30.680],
            [76.830, 30.710],
            [76.835, 30.750],
          ],
        ],
      },
    },

    // 4. Delhi NCT (Central / New Delhi District)
    {
      type: 'Feature',
      properties: {
        name: 'New Delhi / Central Delhi',
        level: 'district',
        state: 'Delhi',
        center: [28.6139, 77.2090],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.160, 28.660],
            [77.240, 28.665],
            [77.260, 28.600],
            [77.200, 28.570],
            [77.150, 28.600],
            [77.160, 28.660],
          ],
        ],
      },
    },

    // 5. South Delhi District
    {
      type: 'Feature',
      properties: {
        name: 'South Delhi (Saket / Hauz Khas)',
        level: 'district',
        state: 'Delhi',
        center: [28.5245, 77.2066],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.150, 28.570],
            [77.260, 28.570],
            [77.280, 28.490],
            [77.160, 28.480],
            [77.150, 28.570],
          ],
        ],
      },
    },

    // 6. Bengaluru Urban (Central & East Hubs)
    {
      type: 'Feature',
      properties: {
        name: 'Bengaluru East (Indiranagar / Whitefield)',
        level: 'district',
        state: 'Karnataka',
        center: [12.9719, 77.6412],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.600, 13.010],
            [77.720, 13.010],
            [77.740, 12.930],
            [77.620, 12.920],
            [77.600, 13.010],
          ],
        ],
      },
    },

    // 7. Bengaluru South (Koramangala / HSR Layout)
    {
      type: 'Feature',
      properties: {
        name: 'Bengaluru South (Koramangala / HSR)',
        level: 'district',
        state: 'Karnataka',
        center: [12.9250, 77.6200],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.580, 12.940],
            [77.670, 12.940],
            [77.680, 12.870],
            [77.580, 12.870],
            [77.580, 12.940],
          ],
        ],
      },
    },
  ],
};
