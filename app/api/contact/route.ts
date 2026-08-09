import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getContent } from "@/app/actions/content";

const resend = new Resend(process.env.RESEND_API);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    // Get the target email from the database, fallback to a default
    let targetEmail = "seneabdoulayelatyr@gmail.com";
    try {
      const contactContent = await getContent("contact-info");
      if (contactContent) {
        const parsed = JSON.parse(contactContent);
        if (parsed && parsed.email) {
          targetEmail = parsed.email;
        }
      }
    } catch (e) {
      console.error("Error fetching target email from DB", e);
    }

    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [targetEmail],
      replyTo: email,
      subject: `Nouveau message de ${name} depuis le Portfolio`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">Nouveau message de contact</h2>
          <p>Vous avez reçu un nouveau message depuis le formulaire de votre portfolio.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 5px 0;"><strong>Nom :</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email :</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
          </div>
          <h3 style="margin-top: 20px;">Message :</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
