"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/LanguageContext";
import { MapPin, Star, Phone, X } from "lucide-react";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SelectedIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Component to handle map centering on selected lawyer
 */
function MapController({ selectedLawyer, lawyers }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLawyer?.latitude && selectedLawyer?.longitude) {
      map.flyTo([selectedLawyer.latitude, selectedLawyer.longitude], 15, {
        duration: 1,
      });
    } else if (lawyers && lawyers.length > 0) {
      // Fit bounds to show all markers
      const validLawyers = lawyers.filter((l) => l.latitude && l.longitude);
      if (validLawyers.length > 0) {
        const bounds = L.latLngBounds(
          validLawyers.map((l) => [l.latitude, l.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedLawyer, lawyers, map]);

  return null;
}

/**
 * Lawyers Map Component
 * Displays interactive map with lawyer location markers
 */

export default function LawyersMap({ lawyers, selectedLawyer, onSelectLawyer }) {
  const mapRef = useRef(null);
  const { t } = useLanguage();

  // Filter lawyers with valid coordinates
  const mappableLawyers = (lawyers || []).filter(
    (lawyer) => lawyer.latitude && lawyer.longitude
  );

  // Default center (Metro Manila)
  const defaultCenter = [14.5995, 120.9842];

  // Calculate center based on lawyers
  const getCenter = () => {
    if (selectedLawyer?.latitude && selectedLawyer?.longitude) {
      return [selectedLawyer.latitude, selectedLawyer.longitude];
    }
    if (mappableLawyers.length > 0) {
      const avgLat =
        mappableLawyers.reduce((sum, l) => sum + l.latitude, 0) /
        mappableLawyers.length;
      const avgLng =
        mappableLawyers.reduce((sum, l) => sum + l.longitude, 0) /
        mappableLawyers.length;
      return [avgLat, avgLng];
    }
    return defaultCenter;
  };

  if (mappableLawyers.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            {t("lawyersMap")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-secondary/50 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">
              {t("noMapLocations")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            {t("lawyersMap")}
          </CardTitle>
          <Badge variant="outline">
            {mappableLawyers.length} {t("locations")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Container */}
        <div className="h-80 rounded-lg overflow-hidden border border-border">
          <MapContainer
            ref={mapRef}
            center={getCenter()}
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ background: "hsl(var(--secondary))" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController
              selectedLawyer={selectedLawyer}
              lawyers={mappableLawyers}
            />

            {mappableLawyers.map((lawyer) => (
              <Marker
                key={lawyer.id}
                position={[lawyer.latitude, lawyer.longitude]}
                icon={
                  selectedLawyer?.id === lawyer.id ? SelectedIcon : DefaultIcon
                }
                eventHandlers={{
                  click: () => onSelectLawyer?.(lawyer),
                }}
              >
                <Popup>
                  <div className="min-w-48 p-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {lawyer.name}
                    </h3>
                    <p className="text-primary text-sm mb-1">
                      {lawyer.specialization}
                    </p>
                    <p className="text-muted-foreground text-sm mb-2">
                      {lawyer.location}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-chart-2 font-medium text-sm">
                        {lawyer.startingPrice || lawyer.consultationFee}
                      </span>
                      {lawyer.rating && (
                        <span className="flex items-center gap-1 text-chart-3 text-sm">
                          <Star className="h-3.5 w-3.5 fill-chart-3" />
                          {lawyer.rating}
                        </span>
                      )}
                    </div>
                    {lawyer.phone && (
                      <a
                        href={`tel:${lawyer.phone}`}
                        className="block w-full text-center bg-primary text-primary-foreground text-sm py-1.5 px-3 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        {t("call")}
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Lawyer Info */}
        {selectedLawyer && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">{t("selected")}:</span>
              <span className="font-semibold text-sm">
                {selectedLawyer.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSelectLawyer?.(null)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Map Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>{t("lawyerLocation")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full" />
            <span>{t("selectedLawyer")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
