"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  GraduationCap,
  Award,
  Briefcase,
  Languages,
  ExternalLink
} from "lucide-react";

export default function LawyerProfileModal({ lawyer, isOpen, onClose }) {
  const { t } = useLanguage();

  if (!lawyer) return null;

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage src={lawyer.image} alt={lawyer.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {getInitials(lawyer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl">{lawyer.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {lawyer.specialization}
              </DialogDescription>
              <div className="flex items-center gap-3 mt-2">
                {lawyer.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-chart-3 fill-chart-3" />
                    <span className="text-sm font-medium">{lawyer.rating}</span>
                    <span className="text-xs text-muted-foreground">/ 5.0</span>
                  </div>
                )}
                {lawyer.verified && (
                  <Badge variant="default" className="text-xs">
                    {t("verified")}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-3">
            {lawyer.location && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{lawyer.location}</span>
              </div>
            )}
            {lawyer.phone && (
              <a
                href={`tel:${lawyer.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{lawyer.phone}</span>
              </a>
            )}
            {lawyer.email && (
              <a
                href={`mailto:${lawyer.email}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{lawyer.email}</span>
              </a>
            )}
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {lawyer.experience && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-xs">{t("experience")}</span>
                </div>
                <p className="text-sm font-medium">{lawyer.experience}</p>
              </div>
            )}
            {lawyer.consultationFee && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{t("consultationFee")}</span>
                </div>
                <p className="text-sm font-medium">{lawyer.consultationFee}</p>
              </div>
            )}
            {lawyer.education && (
              <div className="space-y-1 col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-xs">{t("education")}</span>
                </div>
                <p className="text-sm font-medium">{lawyer.education}</p>
              </div>
            )}
          </div>

          {/* Specializations */}
          {lawyer.specializations && lawyer.specializations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-4 w-4" />
                <span className="text-xs">{t("specializations")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lawyer.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {lawyer.languages && lawyer.languages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Languages className="h-4 w-4" />
                <span className="text-xs">{t("languages")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lawyer.languages.map((lang, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {lawyer.bio && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t("about")}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lawyer.bio}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {lawyer.phone && (
              <Button asChild className="flex-1">
                <a href={`tel:${lawyer.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  {t("call")}
                </a>
              </Button>
            )}
            {lawyer.email && (
              <Button variant="outline" asChild className="flex-1">
                <a href={`mailto:${lawyer.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  {t("email")}
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
