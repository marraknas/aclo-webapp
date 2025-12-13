import shopeeLogo from "../../assets/shopee-white.png";
import tokopediaLogo from "../../assets/tokped-white.png";
import tiktokLogo from "../../assets/tiktok-white.png";
import whatsappLogo from "../../assets/whatsapp-white.png";

const Topbar = () => {
  const iconLinkClass =
    "inline-flex items-center transition-opacity duration-150 hover:opacity-70";

  return (
    <div className="bg-lightbrown text-ink">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center py-2 px-6">
        {/* left: icons */}
        <div className="hidden md:flex items-center space-x-2">
          <a
            href="https://shopee.co.id/aclokids#product_list"
            className={iconLinkClass}
          >
            <img src={shopeeLogo} className="h-6 w-6" alt="Shopee" />
          </a>

          <a
            href="https://api.whatsapp.com/send?phone=6282128528968&text=Halo%20Aclo!%F0%9F%99%8B%F0%9F%8F%BB%E2%80%8D%E2%99%80%EF%B8%8F%20Saya%20tertarik%20dengan%20produk%20Aclo%20%5BFalcon%2FStork%2FSparrow%2FWooden%20Cutting%20Board%5D%20"
            className={iconLinkClass}
          >
            <img src={whatsappLogo} className="h-6 w-6" alt="Tokopedia" />
          </a>

          <a
            href="https://www.tokopedia.com/aclokids?utm_campaign=Shop-133932311-18331362-170225-contextual_image-halaman_toko-LSfHao&utm_source=salinlink&utm_medium=share&_branch_match_id=1375653229267235876&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXL8nPzi9ITclM1MvJzMvW98wrjap0SfI3DkyyrytKTUstKsrMS49PKsovL04tsnXOKMrPTQUAuTCbczwAAAA%3D"
            className={iconLinkClass}
          >
            <img src={tokopediaLogo} className="h-6 w-6" alt="Tokopedia" />
          </a>

          <a href="#" className={iconLinkClass}>
            <img src={tiktokLogo} className="h-6 w-6" alt="TikTok" />
          </a>
        </div>

        {/* center: text */}
        <div className="text-s text-center">
          <span>
            Get a FREE Mitten With Every QUILL Purchase - From 24 Nov to 7 Dec
            Only!
          </span>
        </div>

        {/* right column left empty */}
      </div>
    </div>
  );
};

export default Topbar;
