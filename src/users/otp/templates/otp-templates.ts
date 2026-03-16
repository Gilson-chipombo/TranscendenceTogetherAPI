
export const generateOtpEmail = (otp: string, userName: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Seu Código de Verificação</h2>
      <p>Olá, <strong>${userName}</strong>,</p>
      <p>Use o código abaixo para concluir sua autenticação. Ele expira em 10 minutos.</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffa600;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 12px; color: #777; margin-top: 20px;">
        Se você não solicitou este código, ignore este e-mail.
      </p>
    </div>
  `;
};