"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  LogOut,
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";
import AuthModal from "./AuthModal";

export default function UserProfile() {
  const { user, userProfile, logout, updateUserProfile, loading } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (userProfile?.displayName) {
      setDisplayName(userProfile.displayName);
    }
  }, [userProfile]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setOpen(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    const result = await updateUserProfile({ displayName });
    setSaving(false);

    if (result.success) {
      setMessage({ type: "success", text: t("profileUpdated") });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: result.error || t("updateFailed") });
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          onClick={() => setAuthModalOpen(true)}
          className="gap-2 hover:bg-primary/10"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{t("signIn")}</span>
        </Button>
        <AuthModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          defaultMode="signin"
        />
      </>
    );
  }

  const initials = userProfile?.displayName
    ? userProfile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() || "U";

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="gap-2 hover:bg-primary/10">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline font-medium">
              {userProfile?.displayName || user.email?.split("@")[0]}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-green-500 border-2 border-background p-1">
                  <Shield className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-semibold mb-1">Profile</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Manage your account settings and preferences
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* User Info Card */}
            <Card className="border-border/50">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm mb-0.5 truncate">
                        {userProfile?.displayName || t("user")}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-border/50" />
                  
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-green-500/10 p-1.5">
                      <Shield className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Account verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">Profile Settings</h3>
              </div>

              {message.text && (
                <Alert
                  variant={message.type === "error" ? "destructive" : "default"}
                  className={
                    message.type === "success"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : ""
                  }
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription
                    className={
                      message.type === "success" 
                        ? "text-green-400" 
                        : ""
                    }
                  >
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="profile-displayName" className="text-xs font-medium">
                  Display Name
                </Label>
                <Input
                  id="profile-displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="h-9 bg-secondary/50 border-border/50 focus:border-primary/50 text-sm"
                />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  This name will be displayed in your profile and case history
                </p>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving || !displayName.trim()}
                className="w-full gap-2 h-9 text-sm font-medium shadow-sm"
              >
                {saving ? (
                  <>
                    <Save className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

            <Separator className="bg-border/50" />

            {/* Account Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start gap-2 h-9 text-sm border-destructive/20 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>

            {/* Footer Info */}
            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>LegAIze - Your Legal First AI-d</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
