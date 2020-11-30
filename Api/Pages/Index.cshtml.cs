using Microsoft.AspNetCore.Mvc.RazorPages;
using System.IO;

namespace Api.Pages
{
    public class IndexModel : PageModel
    {
        public FileInfo[] paytakhtStickers;
        public FileInfo[] otherStickers;
        public string paytakhtStickerspath = Directory.GetCurrentDirectory() + "\\wwwroot\\stickers\\paytakht\\";
        public string otherStickerspath = Directory.GetCurrentDirectory() + "\\wwwroot\\stickers\\other\\";

        public void OnGet()
        {
            this.paytakhtStickers = new FileInfo(this.paytakhtStickerspath).Directory.GetFiles();
            this.otherStickers = new FileInfo(this.otherStickerspath).Directory.GetFiles();
        }
    }
}
