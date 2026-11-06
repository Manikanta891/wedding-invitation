/**
 * WhatsApp Click-to-Chat & Preformatted Link Utility
 */

const DEFAULT_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919876543210";

export function formatWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "").replace(/^\+/, "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function getOrderInquiryWhatsAppUrl(orderRef: string, customerName?: string): string {
  const message = `Hello! I have placed an order for a digital invitation (Reference: ${orderRef})${
    customerName ? ` under the name ${customerName}` : ""
  }. I would like to share the photos and details for personalization.`;
  return formatWhatsAppUrl(DEFAULT_PHONE, message);
}

export function getGeneralContactWhatsAppUrl(subject?: string): string {
  const message = `Hello MyBeloved Invitations team! ${
    subject ? `I have an inquiry regarding: ${subject}.` : "I would like to enquire about your digital invitations."
  }`;
  return formatWhatsAppUrl(DEFAULT_PHONE, message);
}

export function getShareInvitationWhatsAppUrl(
  invitationTitle: string,
  invitationUrl: string
): string {
  const message = `✨ You are cordially invited to celebrate ${invitationTitle}! Click here to view the invitation, photos & event schedule: ${invitationUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}
