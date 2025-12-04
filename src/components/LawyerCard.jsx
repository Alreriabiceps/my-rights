"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LawyerProfileModal from "./LawyerProfileModal";
import { useLanguage } from "@/lib/LanguageContext";
import { MapPin, Phone, Mail, Star, Users, ExternalLink, MessageCircle, Navigation } from "lucide-react";

function LawyerCard({ lawyer, onViewOnMap }) {
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCall = () => {
    const phone = lawyer.contact || lawyer.phone;
    if (phone) {
      window.open(`tel:${phone.replace(/\s/g, "")}`, "_self");
    }
  };

  const handleMessage = () => {
    const phone = lawyer.contact || lawyer.phone;
    if (phone) {
      // Format for SMS or Viber/WhatsApp
      window.open(`sms:${phone.replace(/\s/g, "")}`, "_self");
    }
  };

  const handleDirections = () => {
    if (lawyer.latitude && lawyer.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lawyer.latitude},${lawyer.longitude}`,
        "_blank"
      );
    } else if (lawyer.officeAddress || lawyer.location) {
      const address = encodeURIComponent(lawyer.officeAddress || lawyer.location);
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
    }
  };

  return (
    <>
      <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 card-hover">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14 flex-shrink-0">
              <AvatarImage src={lawyer.image} alt={lawyer.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                {getInitials(lawyer.name)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {lawyer.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {lawyer.specialization}
                </p>
              </div>

              {/* Location */}
              {lawyer.location && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{lawyer.location}</span>
                </div>
              )}

              {/* Stats & Price */}
              <div className="flex items-center gap-3 flex-wrap">
                {lawyer.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-chart-3 fill-chart-3" />
                    <span className="text-xs font-medium">{lawyer.rating}</span>
                  </div>
                )}
                {lawyer.experience && (
                  <Badge variant="secondary" className="text-xs">
                    {lawyer.experience}
                  </Badge>
                )}
                {(lawyer.startingPrice || lawyer.consultationFee) && (
                  <span className="text-xs text-chart-2 font-medium">
                    {lawyer.startingPrice || lawyer.consultationFee}
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 pt-1">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCall}
                  className="text-xs h-8 gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {t("call") || "Call"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMessage}
                  className="text-xs h-8 gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDirections}
                  className="text-xs h-8 gap-1.5"
                >
                  <Navigation className="h-3.5 w-3.5" />
                </Button>
                {onViewOnMap && lawyer.latitude && lawyer.longitude && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewOnMap(lawyer)}
                    className="text-xs h-8 gap-1.5 ml-auto"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {/* View Profile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(true)}
                className="text-xs h-7 w-full justify-center text-muted-foreground hover:text-primary"
              >
                {t("viewProfile") || "View Full Profile"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <LawyerProfileModal
        lawyer={lawyer}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export function LawyerList({ lawyers, onViewOnMap }) {
  const { t } = useLanguage();

  if (!lawyers || lawyers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("noLawyersFound") || "No lawyers found"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {t("recommendedLawyers") || "Recommended Lawyers"}
        </h2>
        <Badge variant="outline">{lawyers.length} {t("lawyers") || "lawyers"}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lawyers.map((lawyer, index) => (
          <div 
            key={lawyer.id || index}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards", opacity: 0 }}
          >
            <LawyerCard lawyer={lawyer} onViewOnMap={onViewOnMap} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LawyerCard;
