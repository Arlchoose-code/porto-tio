"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { settingsApi } from "@/lib/api/settings";
import { seoApi } from "@/lib/api/seo";
import { authApi } from "@/lib/api/auth";
import { SiteSetting, SocialLink } from "@/types/settings";
import { SeoSetting } from "@/types/seo";
import { User as AuthUser } from "@/types/auth";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Settings,
  Globe,
  Share2,
  Eye,
  ShieldCheck,
  Check,
  MapPin,
  Mail,
  Phone,
  User,
  Lock,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [site, setSite] = useState<SiteSetting | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [seoList, setSeoList] = useState<SeoSetting[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSite, setSavingSite] = useState(false);

  // Security tab states
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [s, soc, seo, me] = await Promise.allSettled([
          settingsApi.getAdminSiteSettings(),
          settingsApi.getSocialLinks(),
          seoApi.getAllSeoSettings(),
          authApi.getMe(),
        ]);
        if (s.status === "fulfilled") setSite(s.value.data);
        if (soc.status === "fulfilled") setSocials(soc.value.data || []);
        if (seo.status === "fulfilled") setSeoList(seo.value.data || []);
        if (me.status === "fulfilled" && me.value.data) {
          setCurrentUser(me.value.data);
          setAdminName(me.value.data.name);
          setAdminEmail(me.value.data.email);
        }
      } catch (e: any) {
        toast.error("Failed to load settings: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveSite = async () => {
    if (!site) return;
    try {
      setSavingSite(true);
      await settingsApi.updateAdminSiteSettings(site);
      toast.success("Site branding, logo, favicon, and contact info saved! Background revalidation triggered.");
    } catch (e: any) {
      toast.error("Failed to save: " + e.message);
    } finally {
      setSavingSite(false);
    }
  };

  const handleSaveSocial = async (item: SocialLink) => {
    try {
      if (item.id && item.id > 0 && typeof item.id === "number") {
        await settingsApi.updateSocialLink(item.id, {
          platform: item.platform,
          url: item.url,
          icon: item.icon,
          order: Number(item.order),
          is_active: Boolean(item.is_active),
        });
      } else {
        const res = await settingsApi.createSocialLink({
          platform: item.platform,
          url: item.url,
          icon: item.icon,
          order: Number(item.order),
          is_active: true,
        });
        setSocials((prev) => prev.map((s) => (s === item ? res.data : s)));
      }
      toast.success(`Saved social profile: ${item.platform}`);
    } catch (e: any) {
      toast.error("Failed to save social link: " + e.message);
    }
  };

  const handleDeleteSocial = async (id: number) => {
    try {
      setSocials((prev) => prev.filter((s) => s.id !== id));
      if (id > 0) {
        await settingsApi.deleteSocialLink(id);
      }
      toast.success("Social link removed");
    } catch (e: any) {
      toast.error("Failed to delete: " + e.message);
    }
  };

  const handleAddSocial = () => {
    const newEntry: SocialLink = {
      id: Date.now(),
      platform: "GitHub",
      url: "https://",
      icon: "github",
      order: socials.length + 1,
      is_active: true,
    };
    setSocials((prev) => [...prev, newEntry]);
  };

  const handleSaveSeo = async (item: SeoSetting) => {
    try {
      await seoApi.updateSeoSetting(item.id, {
        path: item.path,
        meta_title: item.meta_title,
        meta_description: item.meta_description,
        canonical_url: item.canonical_url,
        og_image: item.og_image,
      });
      toast.success(`SEO metadata for "${item.path}" updated!`);
    } catch (e: any) {
      toast.error("Failed to save SEO: " + e.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminName.trim()) {
      toast.error("Name and email are required");
      return;
    }
    try {
      setUpdatingProfile(true);
      const res = await authApi.updateProfile({
        name: adminName.trim(),
        email: adminEmail.trim(),
      });
      setCurrentUser(res.data);
      toast.success("Admin profile & email updated successfully!");
    } catch (e: any) {
      toast.error("Failed to update profile: " + e.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation password do not match");
      return;
    }
    try {
      setUpdatingPassword(true);
      await authApi.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error("Failed to change password: " + e.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-5xl">
      <AdminHeader
        title="Settings &amp; Global SEO"
        description="Configure website branding, logos, favicons, social media handles, contact info, robots.txt, and admin security credentials."
      />

      <div className="space-y-6">
        <Tabs defaultValue="branding" className="space-y-6">
          <div className="w-full overflow-x-auto pb-1.5 scrollbar-none touch-pan-x">
            <TabsList className="inline-flex w-max min-w-full bg-card/80 border border-border/50 p-1 rounded-2xl shadow-xs">
              <TabsTrigger value="branding" className="gap-2 text-xs py-2 px-3.5 whitespace-nowrap shrink-0">
                <Settings className="h-3.5 w-3.5" />
                <span>Branding &amp; Assets</span>
              </TabsTrigger>
              <TabsTrigger value="socials" className="gap-2 text-xs py-2 px-3.5 whitespace-nowrap shrink-0">
                <Share2 className="h-3.5 w-3.5" />
                <span>Social Media ({socials.length})</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-2 text-xs py-2 px-3.5 whitespace-nowrap shrink-0">
                <Globe className="h-3.5 w-3.5" />
                <span>SEO Paths</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 text-xs py-2 px-3.5 whitespace-nowrap shrink-0 text-primary font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Account &amp; Security</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 1. Global Branding & Assets Tab */}
          <TabsContent value="branding" className="space-y-4">
            <FormWrapper
              title="Global Site Branding &amp; Assets"
              description="Controls website title, logos, favicons, global description, footer copyright, and crawler robots.txt"
              actions={
                <Button onClick={handleSaveSite} disabled={savingSite} size="sm" className="gap-2 text-xs">
                  {savingSite ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  <span>Save Site Settings</span>
                </Button>
              }
            >
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Website Title *</Label>
                  <Input
                    value={site?.title || ""}
                    onChange={(e) => setSite((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                    placeholder="e.g. Sulistio Murti Mulyono — Digital Business &amp; PM"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Tagline / Meta Description</Label>
                  <Input
                    value={site?.description || ""}
                    onChange={(e) => setSite((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                    placeholder="Brief description for SEO search engines..."
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Short Bio / Footer Biography</Label>
                  <Textarea
                    value={site?.bio_short || ""}
                    onChange={(e) => setSite((prev) => (prev ? { ...prev, bio_short: e.target.value } : null))}
                    placeholder="Brief bio narrative displayed in footer..."
                    rows={2}
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>Address / Base Location</span>
                    </Label>
                    <Input
                      value={site?.address || ""}
                      onChange={(e) => setSite((prev) => (prev ? { ...prev, address: e.target.value } : null))}
                      placeholder="e.g. Bogor &amp; Jakarta, Indonesia"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>Direct Contact Email</span>
                    </Label>
                    <Input
                      value={site?.email || ""}
                      onChange={(e) => setSite((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                      placeholder="e.g. tiomurti4@gmail.com"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>Phone / WhatsApp</span>
                    </Label>
                    <Input
                      value={site?.phone || ""}
                      onChange={(e) => setSite((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                      placeholder="e.g. +62 819-1984-4369"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <ImageUploadField
                    label="Website Logo"
                    value={site?.logo}
                    onChange={(val) => setSite((prev) => (prev ? { ...prev, logo: val.original } : null))}
                    description="Displayed in navbar header &amp; footer brand"
                  />

                  <ImageUploadField
                    label="Browser Favicon"
                    value={site?.favicon}
                    onChange={(val) => setSite((prev) => (prev ? { ...prev, favicon: val.original } : null))}
                    description="Displayed in browser tab (PNG / ICO / WebP)"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-semibold">Footer Copyright Text</Label>
                  <Input
                    value={site?.footer_text || ""}
                    onChange={(e) => setSite((prev) => (prev ? { ...prev, footer_text: e.target.value } : null))}
                    placeholder="© 2026 Sulistio Murti Mulyono. All rights reserved."
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-semibold">Search Engine Robots (robots.txt content)</Label>
                  <Textarea
                    value={site?.robots_txt || ""}
                    onChange={(e) => setSite((prev) => (prev ? { ...prev, robots_txt: e.target.value } : null))}
                    placeholder="User-agent: *&#10;Allow: /"
                    rows={4}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </FormWrapper>
          </TabsContent>

          {/* 2. Social Media Handles Tab */}
          <TabsContent value="socials" className="space-y-4">
            <FormWrapper
              title="Social Media Links"
              description="Manage public social platform links (LinkedIn, GitHub, Email, WhatsApp, etc.)."
              actions={
                <Button size="sm" variant="outline" onClick={handleAddSocial} className="gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Social Profile</span>
                </Button>
              }
            >
              <div className="space-y-3">
                {socials.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No social media links configured yet.</p>
                ) : (
                  socials.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col md:flex-row items-start md:items-center gap-3 justify-between"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                        <div>
                          <Label className="text-[11px] text-muted-foreground">Platform</Label>
                          <Input
                            value={item.platform}
                            onChange={(e) => {
                              const updated = { ...item, platform: e.target.value };
                              setSocials(socials.map((s) => (s === item ? updated : s)));
                            }}
                            className="h-8 text-xs font-medium"
                          />
                        </div>

                        <div>
                          <Label className="text-[11px] text-muted-foreground">URL Target</Label>
                          <Input
                            value={item.url}
                            onChange={(e) => {
                              const updated = { ...item, url: e.target.value };
                              setSocials(socials.map((s) => (s === item ? updated : s)));
                            }}
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-[11px] text-muted-foreground">Icon Identifier</Label>
                          <Input
                            value={item.icon}
                            onChange={(e) => {
                              const updated = { ...item, icon: e.target.value };
                              setSocials(socials.map((s) => (s === item ? updated : s)));
                            }}
                            placeholder="e.g. linkedin, github, mail"
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 md:pt-4 self-end md:self-auto">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSaveSocial(item)}
                          className="h-8 text-xs gap-1"
                        >
                          <Check className="h-3 w-3" />
                          <span>Save</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSocial(item.id)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </FormWrapper>
          </TabsContent>

          {/* 3. SEO Global & Per-Path Tab */}
          <TabsContent value="seo" className="space-y-4">
            <FormWrapper
              title="Per-Path Meta SEO &amp; OpenGraph"
              description="Customize page title, meta description, and social share previews for every major URL route."
            >
              <div className="space-y-4">
                {seoList.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No SEO route overrides found.</p>
                ) : (
                  seoList.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {item.path}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveSeo(item)}
                          className="h-7 text-xs gap-1"
                        >
                          <Save className="h-3 w-3" />
                          <span>Save Path SEO</span>
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-medium">Meta Title</Label>
                          <Input
                            value={item.meta_title || ""}
                            onChange={(e) => {
                              const updated = { ...item, meta_title: e.target.value };
                              setSeoList(seoList.map((x) => (x.id === item.id ? updated : x)));
                            }}
                            className="h-8 text-xs"
                            placeholder="Page title..."
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-medium">Meta Description</Label>
                          <Input
                            value={item.meta_description || ""}
                            onChange={(e) => {
                              const updated = { ...item, meta_description: e.target.value };
                              setSeoList(seoList.map((x) => (x.id === item.id ? updated : x)));
                            }}
                            className="h-8 text-xs"
                            placeholder="Meta description for search engines..."
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </FormWrapper>
          </TabsContent>

          {/* 4. Account & Security Tab (Ganti Email & Password) */}
          <TabsContent value="security" className="space-y-6">
            {/* Profile & Email Card */}
            <FormWrapper
              title="Admin Profile &amp; Login Email"
              description="Update your administrator display name and login email address."
            >
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>Administrator Name</span>
                    </Label>
                    <Input
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Sulistio Murti Mulyono"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>Login Email Address *</span>
                    </Label>
                    <Input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@tiomurti.com"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updatingProfile} size="sm" className="gap-2 text-xs">
                    {updatingProfile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    <span>Update Profile &amp; Email</span>
                  </Button>
                </div>
              </form>
            </FormWrapper>

            {/* Password Change Card */}
            <FormWrapper
              title="Change Password"
              description="Ensure your administrative account uses a strong, unique password."
            >
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Current Password *</span>
                  </Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="h-9 text-xs max-w-md"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>New Password (min. 6 characters) *</span>
                    </Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                      <span>Confirm New Password *</span>
                    </Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updatingPassword} size="sm" className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                    {updatingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    <span>Update Password</span>
                  </Button>
                </div>
              </form>
            </FormWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}