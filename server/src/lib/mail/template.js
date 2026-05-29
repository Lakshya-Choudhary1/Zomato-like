export const verificationTemplate = (name, token) => {
  return `
     <!DOCTYPE html>
     <html>
     <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
     </head>
     <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px;">
               
               <h2 style="color: #333;">Verify Your Email</h2>

               <p>Hello <strong>${name}</strong>,</p>

               <p>
                    Thank you for registering. Please use the verification code below
                    to verify your email address.
               </p>

               <div style="text-align: center; margin: 30px 0;">
                    <span style="
                         display: inline-block;
                         background: #4f46e5;
                         color: white;
                         padding: 15px 30px;
                         font-size: 24px;
                         letter-spacing: 5px;
                         border-radius: 8px;
                         font-weight: bold;
                    ">
                         ${token}
                    </span>
               </div>

               <p>This code will expire in 10 minutes.</p>

               <p>If you did not create this account, please ignore this email.</p>

               <hr style="margin-top: 30px;" />

               <p style="font-size: 12px; color: gray;">
                    © ${new Date().getFullYear()} Your Company. All rights reserved.
               </p>

          </div>

     </body>
     </html>
     `;
};

export const forgotPasswordTemplate = (link) => {
  return `
     <!DOCTYPE html>
     <html>
     <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
     </head>
     <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px;">
               
               <h2 style="color: #333;">Reset Your Password</h2>

               <p>
                    We received a request to reset your password.
               </p>

               <p>
                    Click the button below to create a new password:
               </p>

               <div style="text-align: center; margin: 30px 0;">
                    <a 
                         href="${link}" 
                         style="
                              background: #ef4444;
                              color: white;
                              text-decoration: none;
                              padding: 14px 28px;
                              border-radius: 8px;
                              font-size: 16px;
                              font-weight: bold;
                              display: inline-block;
                         "
                    >
                         Reset Password
                    </a>
               </div>

               <p>
                    This link will expire in 10 minutes.
               </p>

               <p>
                    If you did not request a password reset, you can safely ignore this email.
               </p>

               <hr style="margin-top: 30px;" />

               <p style="font-size: 12px; color: gray;">
                    © ${new Date().getFullYear()} Your Company. All rights reserved.
               </p>

          </div>

     </body>
     </html>
     `;
};
