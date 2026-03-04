using System;
using System.IO;
using System.IO.Compression;
using System.Diagnostics;
using System.Security.Principal;
using System.Windows.Forms;

namespace EmojiToPNGInstaller
{
    class Program
    {
        static void Main()
        {
            // Check for Administrator privileges
            WindowsPrincipal principal = new WindowsPrincipal(WindowsIdentity.GetCurrent());
            if (!principal.IsInRole(WindowsBuiltInRole.Administrator))
            {
                ProcessStartInfo processInfo = new ProcessStartInfo();
                processInfo.Verb = "runas";
                processInfo.FileName = Application.ExecutablePath;
                try
                {
                    Process.Start(processInfo);
                }
                catch (Exception)
                {
                    MessageBox.Show("Administrator privileges are required to install Emoji to PNG for all users.", "Permission Denied", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                return;
            }

            string payload = "BASE64_PLACEHOLDER";
            string targetDir = @"C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.dapkeakash9.emojitopng";
            
            try
            {
                if (Directory.Exists(targetDir))
                {
                    Directory.Delete(targetDir, true);
                }
                Directory.CreateDirectory(targetDir);

                byte[] zipBytes = Convert.FromBase64String(payload);
                string tempZip = Path.Combine(Path.GetTempPath(), "emojitopng_installer_temp.zip");
                File.WriteAllBytes(tempZip, zipBytes);
                
                ZipFile.ExtractToDirectory(tempZip, targetDir);
                File.Delete(tempZip);
                
                MessageBox.Show("Emoji to PNG has been successfully installed!\n\nPlease restart Premiere Pro or After Effects to use the extension.", "Emoji to PNG Setup", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Installation failed:\n" + ex.Message, "Setup Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
