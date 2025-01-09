// share modal
export default function ShareModal({ isOpen, onClose, position, bookingData }) {
  if (!isOpen) return null;

  const shareUrl =
    "https://minor-cineplex-nine.vercel.app/sharing/" + temp_booking_uuid ; // URL ที่ต้องการแชร์
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const text = `🎥 ชวนมาดู "${bookingData.title}" ด้วยกัน! 🥳
✨ จองตั๋วได้ง่ายๆ ที่นี่: `;

  const handleLineShare = () => {
    if (isMobile) {
      // Mobile: ใช้ Deep Link
      const lineDeepLink = `line://msg/text/${encodeURIComponent(
        text + shareUrl
      )}`;
      window.location.href = lineDeepLink;
    } else {
      // Desktop: ใช้ Web URL
      const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(lineShareUrl, "_blank");
    }
  };

  const handleMessengerShare = () => {
    if (isMobile) {
      // สำหรับ Mobile: ใช้ Messenger Deep Link
      const messengerDeepLink = `fb-messenger://share?link=${encodeURIComponent(
        shareUrl
      )}`;
      window.location.href = messengerDeepLink;
    } else {
      // สำหรับ Desktop: ใช้ Facebook Messenger Web URL
      const appId = "1113441710515558"; // แทนที่ด้วย AppID ของคุณ

      const messengerShareUrl = `https://www.messenger.com/t/?link=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(text + shareUrl)}`;
      window.open(messengerShareUrl, "_blank");
    }
  };

  const handleFacebookShare = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookShareUrl, "_blank");
  };

  const handleTwitterShare = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(text)}`;
    window.open(twitterShareUrl, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-default "
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className={`absolute z-50 bg-[#21263F] p-4 rounded-lg  shadow-share w-[432px] h-[128px] cursor-default flex flex-col gap-2 max-sm:w-[274px]  max-sm:h-[208px] `}
        style={{
          top: position.top + (window.innerWidth < 640 ? 20 : 30),
          left: position.left + (window.innerWidth < 640 ? -200 : -410),
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-center items-center ">
          <h2 className="text-white text-base font-bold">
            Share Booking
          </h2>
        </div>

        <div className="flex justify-between items-center gap-1 text-sm max-sm:grid max-sm:grid-cols-3  ">
          <button
            className="flex flex-col items-center"
            onClick={handleLineShare}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#070C1B" />
              <path
                d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20Z"
                fill="#00B900"
              />
              <path
                d="M20.1666 14.6667C16.7666 14.6667 14 16.8954 14 19.6349C14 22.0909 16.1938 24.1477 19.1573 24.5366C19.3581 24.5796 19.6314 24.668 19.7006 24.8385C19.7628 24.9933 19.7413 25.2357 19.7205 25.3921C19.7205 25.3921 19.6481 25.8241 19.6325 25.9161C19.6057 26.0709 19.5086 26.5214 20.1666 26.2461C20.8248 25.9708 23.718 24.1701 25.0118 22.6916C25.9053 21.7187 26.3333 20.7313 26.3333 19.6349C26.3333 16.8954 23.5671 14.6667 20.1666 14.6667Z"
                fill="white"
              />
              <path
                d="M18.4511 18.3333C18.3854 18.3333 18.332 18.3884 18.332 18.4562V21.2104C18.332 21.2783 18.3854 21.3333 18.4511 21.3333H18.8797C18.9454 21.3333 18.9987 21.2783 18.9987 21.2104V18.4562C18.9987 18.3884 18.9454 18.3333 18.8797 18.3333H18.4511Z"
                fill="#00B900"
              />
              <path
                d="M21.8734 18.3333H21.4223C21.3531 18.3333 21.297 18.3884 21.297 18.4562V20.0925L20.0128 18.388C20.0098 18.3836 20.0065 18.3795 20.003 18.3755L20.0022 18.3748C19.9997 18.372 19.9972 18.3695 19.9946 18.3671C19.9939 18.3664 19.9931 18.3658 19.9923 18.3651C19.9902 18.3631 19.988 18.3613 19.9856 18.3596C19.9846 18.3586 19.9835 18.3579 19.9824 18.3571C19.9802 18.3556 19.9781 18.354 19.9759 18.3527C19.9747 18.3519 19.9734 18.3511 19.9721 18.3505C19.9698 18.3492 19.9676 18.3479 19.9654 18.3468C19.9641 18.3462 19.9628 18.3454 19.9615 18.3449C19.9591 18.3439 19.9568 18.3428 19.9543 18.3419C19.9528 18.3414 19.9516 18.3409 19.9502 18.3405C19.9478 18.3396 19.9453 18.3388 19.9427 18.3382C19.9414 18.3377 19.9399 18.3374 19.9384 18.3369C19.9359 18.3365 19.9336 18.3359 19.9313 18.3354C19.9295 18.3351 19.9277 18.3349 19.926 18.3348C19.9237 18.3343 19.9215 18.3342 19.9193 18.3339C19.9172 18.3337 19.9151 18.3337 19.9129 18.3336C19.9113 18.3336 19.91 18.3333 19.9084 18.3333H19.4574C19.3883 18.3333 19.332 18.3884 19.332 18.4562V21.2104C19.332 21.2783 19.3883 21.3333 19.4574 21.3333H19.9084C19.9777 21.3333 20.0338 21.2783 20.0338 21.2104V19.5746L21.3197 21.2813C21.3286 21.2937 21.3396 21.3037 21.3515 21.3117C21.3519 21.312 21.3524 21.3124 21.3527 21.3127C21.3553 21.3143 21.3579 21.3159 21.3605 21.3173C21.3617 21.318 21.3629 21.3185 21.3641 21.3191C21.3659 21.3202 21.368 21.3212 21.37 21.322C21.3721 21.3229 21.374 21.3237 21.3762 21.3246C21.3774 21.3251 21.3786 21.3256 21.3799 21.3259C21.3828 21.327 21.3855 21.3279 21.3884 21.3287C21.389 21.3287 21.3896 21.329 21.3902 21.3291C21.4005 21.3317 21.4112 21.3333 21.4223 21.3333H21.8734C21.9427 21.3333 21.9987 21.2783 21.9987 21.2104V18.4562C21.9987 18.3884 21.9427 18.3333 21.8734 18.3333Z"
                fill="#00B900"
              />
              <path
                d="M17.8782 20.6436H16.6837V18.4564C16.6837 18.3884 16.6291 18.3333 16.5618 18.3333H16.1221C16.0547 18.3333 16 18.3884 16 18.4564V21.2101V21.2103C16 21.2434 16.0131 21.2733 16.0341 21.2954C16.0346 21.296 16.0351 21.2966 16.0358 21.2972C16.0364 21.2978 16.037 21.2983 16.0376 21.2989C16.0596 21.3202 16.0891 21.3333 16.1219 21.3333H17.8782C17.9456 21.3333 18 21.2781 18 21.2101V20.7667C18 20.6988 17.9456 20.6436 17.8782 20.6436Z"
                fill="#00B900"
              />
              <path
                d="M24.2102 19.023C24.2776 19.023 24.332 18.968 24.332 18.8999V18.4565C24.332 18.3886 24.2776 18.3333 24.2102 18.3333H22.4541H22.4539C22.4209 18.3333 22.3913 18.3466 22.3693 18.3681C22.3688 18.3686 22.3682 18.3689 22.3678 18.3694C22.3671 18.3701 22.3665 18.3709 22.3659 18.3716C22.345 18.3937 22.332 18.4235 22.332 18.4564V18.4565V21.2102V21.2103C22.332 21.2434 22.3451 21.2733 22.3662 21.2954C22.3666 21.296 22.3672 21.2967 22.3678 21.2972C22.3683 21.2978 22.369 21.2984 22.3696 21.2989C22.3915 21.3201 22.4212 21.3333 22.4539 21.3333H24.2102C24.2776 21.3333 24.332 21.2781 24.332 21.2102V20.7667C24.332 20.6989 24.2776 20.6436 24.2102 20.6436H23.0159V20.1781H24.2102C24.2776 20.1781 24.332 20.123 24.332 20.055V19.6116C24.332 19.5437 24.2776 19.4884 24.2102 19.4884H23.0159V19.023H24.2102Z"
                fill="#00B900"
              />
            </svg>

            <span className="text-sm text-[#C8CEDD] mt-2">LINE</span>
          </button>

          <button
            className="flex flex-col items-center"
            onClick={handleMessengerShare}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#070C1B" />
              <path
                d="M13.6445 26.404V29.9553L16.9652 28.0674C17.8908 28.3342 18.8748 28.4782 19.8942 28.4782C25.359 28.4782 29.7884 24.3447 29.7884 19.2466C29.7884 14.148 25.359 10.0149 19.8942 10.0149C14.4298 10.0149 10 14.148 10 19.2466C10 22.1335 11.4203 24.7113 13.6445 26.404Z"
                fill="url(#paint0_linear_91_5057)"
              />
              <path
                d="M18.8398 16.7181L13.5039 22.3677L18.36 19.7033L20.8973 22.3677L26.203 16.7181L21.4008 19.3358L18.8398 16.7181Z"
                fill="white"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_91_5057"
                  x1="11.1042"
                  y1="11.3629"
                  x2="11.1042"
                  y2="29.0779"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00C6FF" />
                  <stop offset="1" stopColor="#0068FF" />
                </linearGradient>
              </defs>
            </svg>

            <span className="text-sm text-[#C8CEDD] mt-2">Messenger</span>
          </button>

          <button
            className="flex flex-col items-center"
            onClick={handleFacebookShare}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#070C1B" />
              <g clipPath="url(#clip0_91_5060)">
                <path
                  d="M30 20C30 14.4771 25.5229 10 20 10C14.4771 10 10 14.4771 10 20C10 24.9912 13.6568 29.1283 18.4375 29.8785V22.8906H15.8984V20H18.4375V17.7969C18.4375 15.2906 19.9305 13.9063 22.2146 13.9063C23.3084 13.9063 24.4531 14.1016 24.4531 14.1016V16.5625H23.1922C21.95 16.5625 21.5625 17.3334 21.5625 18.125V20H24.3359L23.8926 22.8906H21.5625V29.8785C26.3432 29.1283 30 24.9912 30 20Z"
                  fill="#1877F2"
                />
                <path
                  d="M23.8926 22.8906L24.3359 20H21.5625V18.125C21.5625 17.3342 21.95 16.5625 23.1922 16.5625H24.4531V14.1016C24.4531 14.1016 23.3088 13.9062 22.2146 13.9062C19.9305 13.9062 18.4375 15.2906 18.4375 17.7969V20H15.8984V22.8906H18.4375V29.8785C19.4729 30.0405 20.5271 30.0405 21.5625 29.8785V22.8906H23.8926Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_91_5060">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(10 10)"
                  />
                </clipPath>
              </defs>
            </svg>

            <span className="text-sm text-[#C8CEDD] mt-2">Facebook</span>
          </button>

          <button
            className="flex flex-col items-center"
            onClick={handleTwitterShare}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#070C1B" />
              <path
                d="M16.2896 28.1256C23.8368 28.1256 27.9648 21.8728 27.9648 16.4504C27.9648 16.2728 27.9648 16.096 27.9528 15.92C28.7559 15.3391 29.4491 14.6199 30 13.796C29.2512 14.128 28.4567 14.3456 27.6432 14.4416C28.4998 13.9288 29.141 13.1222 29.4472 12.172C28.6417 12.65 27.7605 12.9868 26.8416 13.168C26.2229 12.5101 25.4047 12.0745 24.5135 11.9285C23.6223 11.7826 22.7078 11.9344 21.9116 12.3605C21.1154 12.7866 20.4819 13.4633 20.109 14.2857C19.7361 15.1082 19.6446 16.0307 19.8488 16.9104C18.2174 16.8285 16.6215 16.4045 15.1645 15.666C13.7076 14.9274 12.4223 13.8907 11.392 12.6232C10.8673 13.5265 10.7066 14.5958 10.9426 15.6135C11.1786 16.6312 11.7936 17.5206 12.6624 18.1008C12.0094 18.0816 11.3705 17.9054 10.8 17.5872V17.6392C10.8003 18.5865 11.1282 19.5046 11.7282 20.2378C12.3282 20.9709 13.1634 21.474 14.092 21.6616C13.4879 21.8263 12.8541 21.8504 12.2392 21.732C12.5015 22.5472 13.012 23.2602 13.6994 23.7711C14.3867 24.282 15.2165 24.5654 16.0728 24.5816C15.222 25.2503 14.2478 25.7447 13.2057 26.0366C12.1637 26.3284 11.0743 26.4119 10 26.2824C11.8765 27.4865 14.0599 28.1253 16.2896 28.1224"
                fill="#1DA1F2"
              />
            </svg>

            <span className="text-sm text-[#C8CEDD] mt-2">Twitter</span>
          </button>

          <button
            className="flex flex-col items-center"
            onClick={handleCopyLink}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#070C1B" />
              <path
                d="M22 15V15C22 14.0681 22 13.6022 21.8478 13.2346C21.6448 12.7446 21.2554 12.3552 20.7654 12.1522C20.3978 12 19.9319 12 19 12H16C14.1144 12 13.1716 12 12.5858 12.5858C12 13.1716 12 14.1144 12 16V19C12 19.9319 12 20.3978 12.1522 20.7654C12.3552 21.2554 12.7446 21.6448 13.2346 21.8478C13.6022 22 14.0681 22 15 22V22"
                stroke="#C8CEDD"
              />
              <rect
                x="18"
                y="18"
                width="10"
                height="10"
                rx="2"
                stroke="#C8CEDD"
              />
            </svg>

            <span className="text-sm text-[#C8CEDD] mt-2">Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}
