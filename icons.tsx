// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { runtime } from "./services.ts";
import { tw } from "./deps.ts";
import { h } from "https://esm.sh/v87/preact@10.8.1/deno/preact.js";

export function Dir(props: { class?: string }) {
  return (
    <svg
      class={tw`${props.class ?? ""}`}
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.6 1.80002H7L5.6 0.400024H1.4C0.63 0.400024 0.00699999 1.03002 0.00699999 1.80002L0 10.2C0 10.97 0.63 11.6 1.4 11.6H12.6C13.37 11.6 14 10.97 14 10.2V3.20002C14 2.43002 13.37 1.80002 12.6 1.80002ZM12.6 10.2H1.4V3.20002H12.6V10.2Z"
        fill="#6C6E78"
      />
    </svg>
  );
}

export function Source(props: { class?: string }) {
  return (
    <svg
      class={tw(props.class ?? "")}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.16675 12.6667H11.3334C11.6428 12.6667 11.9396 12.5438 12.1584 12.325C12.3772 12.1062 12.5001 11.8094 12.5001 11.5V4.20834L9.29175 1H4.33342C4.024 1 3.72725 1.12292 3.50846 1.34171C3.28966 1.5605 3.16675 1.85725 3.16675 2.16667V4.5"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.08334 10.3333L7.83334 8.58334L6.08334 6.83334M3.75 6.83334L2 8.58334L3.75 10.3333M9.00001 1V4.5H12.5L9.00001 1Z"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function Index() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 4C2.26522 4 2.51957 3.89464 2.70711 3.70711C2.89464 3.51957 3 3.26522 3 3C3 2.73478 2.89464 2.48043 2.70711 2.29289C2.51957 2.10536 2.26522 2 2 2C1.73478 2 1.48043 2.10536 1.29289 2.29289C1.10536 2.48043 1 2.73478 1 3C1 3.26522 1.10536 3.51957 1.29289 3.70711C1.48043 3.89464 1.73478 4 2 4ZM5.75 2.5C5.55109 2.5 5.36032 2.57902 5.21967 2.71967C5.07902 2.86032 5 3.05109 5 3.25C5 3.44891 5.07902 3.63968 5.21967 3.78033C5.36032 3.92098 5.55109 4 5.75 4H14.25C14.4489 4 14.6397 3.92098 14.7803 3.78033C14.921 3.63968 15 3.44891 15 3.25C15 3.05109 14.921 2.86032 14.7803 2.71967C14.6397 2.57902 14.4489 2.5 14.25 2.5H5.75ZM5.75 7.5C5.55109 7.5 5.36032 7.57902 5.21967 7.71967C5.07902 7.86032 5 8.05109 5 8.25C5 8.44891 5.07902 8.63968 5.21967 8.78033C5.36032 8.92098 5.55109 9 5.75 9H14.25C14.4489 9 14.6397 8.92098 14.7803 8.78033C14.921 8.63968 15 8.44891 15 8.25C15 8.05109 14.921 7.86032 14.7803 7.71967C14.6397 7.57902 14.4489 7.5 14.25 7.5H5.75ZM5.75 12.5C5.55109 12.5 5.36032 12.579 5.21967 12.7197C5.07902 12.8603 5 13.0511 5 13.25C5 13.4489 5.07902 13.6397 5.21967 13.7803C5.36032 13.921 5.55109 14 5.75 14H14.25C14.4489 14 14.6397 13.921 14.7803 13.7803C14.921 13.6397 15 13.4489 15 13.25C15 13.0511 14.921 12.8603 14.7803 12.7197C14.6397 12.579 14.4489 12.5 14.25 12.5H5.75ZM3 8C3 8.26522 2.89464 8.51957 2.70711 8.70711C2.51957 8.89464 2.26522 9 2 9C1.73478 9 1.48043 8.89464 1.29289 8.70711C1.10536 8.51957 1 8.26522 1 8C1 7.73478 1.10536 7.48043 1.29289 7.29289C1.48043 7.10536 1.73478 7 2 7C2.26522 7 2.51957 7.10536 2.70711 7.29289C2.89464 7.48043 3 7.73478 3 8ZM2 14C2.26522 14 2.51957 13.8946 2.70711 13.7071C2.89464 13.5196 3 13.2652 3 13C3 12.7348 2.89464 12.4804 2.70711 12.2929C2.51957 12.1054 2.26522 12 2 12C1.73478 12 1.48043 12.1054 1.29289 12.2929C1.10536 12.4804 1 12.7348 1 13C1 13.2652 1.10536 13.5196 1.29289 13.7071C1.48043 13.8946 1.73478 14 2 14Z"
        fill="#6C6E78"
      />
    </svg>
  );
}

export function TriangleRight(
  props: {
    class?: string;
    tabindex?: number;
    onKeyDown?: string;
    "aria-label"?: string;
  },
) {
  return (
    // @ts-ignore onKeyDown does support strings
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      {...props}
    >
      <path d="M2.5 10L7.5 5L2.5 0V10Z" fill="currentColor" />
    </svg>
  );
}

export function Copy() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.55566 2.7C1.55566 2.03726 2.09292 1.5 2.75566 1.5H8.75566C9.41841 1.5 9.95566 2.03726 9.95566 2.7V5.1H12.3557C13.0184 5.1 13.5557 5.63726 13.5557 6.3V12.3C13.5557 12.9627 13.0184 13.5 12.3557 13.5H6.35566C5.69292 13.5 5.15566 12.9627 5.15566 12.3V9.9H2.75566C2.09292 9.9 1.55566 9.36274 1.55566 8.7V2.7ZM6.35566 9.9V12.3H12.3557V6.3H9.95566V8.7C9.95566 9.36274 9.41841 9.9 8.75566 9.9H6.35566ZM8.75566 8.7V2.7L2.75566 2.7V8.7H8.75566Z"
        fill="#232323"
      />
    </svg>
  );
}

export function LongArrowRight(props: { class?: string }) {
  return (
    <svg
      class={tw(props.class ?? "")}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <g clip-path="url(#clip0_2067_129)">
        <path
          d="M10.2006 10.7994C10.0058 10.9942 9.68993 10.9947 9.49451 10.8003L9.40285 10.7092C9.20655 10.514 9.20624 10.1964 9.40215 10.0008L11.8284 7.5785H0.499999C0.223857 7.5785 0 7.35465 0 7.0785V6.92148C0 6.64534 0.223858 6.42148 0.5 6.42148H11.8284L9.40258 3.9957C9.20654 3.79967 9.20743 3.48156 9.40456 3.28663L9.49452 3.19767C9.69009 3.00427 10.0052 3.00515 10.1996 3.19964L13.6464 6.64644C13.8417 6.8417 13.8417 7.15828 13.6464 7.35355L10.2006 10.7994Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2067_129">
          <rect
            width="14"
            height="14"
            fill="white"
            transform="matrix(1 0 0 -1 0 14)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export function GitHub(props: { class?: string }) {
  return (
    <svg
      class={tw`h-6 w-6 ${props.class ?? ""}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Discord(props: { class?: string }) {
  return (
    <svg
      class={tw`h-6 w-6 ${props.class ?? ""}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273-1.47-1.338-1.604-1.398.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.476V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537-1.336-.668-2.54-1.002-3.744-1.137-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02 0 0 1 1.74 3.743 1.806 0 0 .4-.533.805-1.002-1.54-.468-2.14-1.404-2.14-1.404s.134.066.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03.33.136.66.27.93.4a8.18 8.18 0 001.8.536c.93.135 1.996.2 3.21 0 .6-.135 1.2-.267 1.8-.535.39-.2.87-.4 1.397-.737 0 0-.6.936-2.205 1.404.33.466.795 1 .795 1 2.744-.06 3.81-1.8 3.87-1.726 0-3.87-1.815-7.02-1.815-7.02-1.635-1.214-3.165-1.26-3.435-1.26l.056-.02zm.168 4.413c.703 0 1.27.6 1.27 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334.002-.74.573-1.338 1.27-1.338zm-4.543 0c.7 0 1.266.6 1.266 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334 0-.74.57-1.338 1.27-1.338z" />
    </svg>
  );
}

export function Twitter(props: { class?: string }) {
  return (
    <svg
      class={tw`h-6 w-6 ${props.class ?? ""}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  );
}

export function Plus() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1.75"
        y1="7"
        x2="12.25"
        y2="7"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line
        x1="7"
        y1="1.75"
        x2="7"
        y2="12.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}

export function Minus(props: { class?: string }) {
  return (
    <svg
      class={tw(props.class ?? "")}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1.75"
        y1="7"
        x2="12.25"
        y2="7"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 0C23.2843 0 30 6.71572 30 15C30 23.2843 23.2843 30 15 30C6.71572 30 0 23.2843 0 15C0 6.71572 6.71572 0 15 0Z"
        fill="#232323"
      />
      <path
        d="M14.6635 22.3394C14.2788 22.2357 13.8831 22.4584 13.7705 22.8381L13.7655 22.8558L12.7694 26.5472L12.7649 26.565C12.6711 26.9498 12.9011 27.3414 13.2858 27.4451C13.6704 27.549 14.0661 27.3263 14.1787 26.9465L14.1837 26.9289L15.1797 23.2375L15.1843 23.2196C15.1911 23.1919 15.1962 23.164 15.1997 23.1362L15.2026 23.1084L15.179 22.9888L15.1445 22.8166L15.1227 22.7091C15.076 22.619 15.0111 22.5396 14.932 22.4759C14.853 22.4123 14.7615 22.3658 14.6635 22.3394ZM7.7224 18.5379C7.70424 18.5741 7.68883 18.6123 7.67658 18.6522L7.66967 18.6763L6.67358 22.3677L6.669 22.3856C6.57525 22.7704 6.80524 23.1619 7.1899 23.2657C7.57451 23.3695 7.97026 23.1469 8.08287 22.7671L8.08779 22.7494L8.99096 19.4023C8.51793 19.1518 8.09336 18.8628 7.7224 18.5379ZM5.34707 14.2929C4.9624 14.1891 4.56666 14.4117 4.4541 14.7915L4.44912 14.8092L3.45303 18.5006L3.44846 18.5184C3.35471 18.9032 3.58469 19.2947 3.96936 19.3985C4.35397 19.5023 4.74971 19.2797 4.86232 18.8999L4.86725 18.8822L5.86334 15.1908L5.86791 15.173C5.96166 14.7882 5.73174 14.3967 5.34707 14.2929ZM27.682 13.4546C27.2973 13.3508 26.9015 13.5734 26.789 13.9532L26.784 13.9709L25.7879 17.6623L25.7833 17.6801C25.6896 18.0649 25.9196 18.4564 26.3042 18.5602C26.6889 18.664 27.0846 18.4414 27.1972 18.0616L27.2021 18.0439L28.1982 14.3525L28.2028 14.3347C28.2965 13.9499 28.0666 13.5584 27.682 13.4546ZM3.17781 8.52527C2.34361 10.0444 1.81243 11.7112 1.61377 13.4329C1.7088 13.5412 1.83381 13.619 1.97301 13.6563C2.35768 13.7602 2.75342 13.5375 2.86598 13.1577L2.87096 13.1401L3.86705 9.44865L3.87162 9.43084C3.96537 9.04599 3.73539 8.65447 3.35072 8.5507C3.2943 8.53547 3.23623 8.52694 3.17781 8.52527ZM25.159 8.5507C24.7744 8.44687 24.3786 8.66953 24.266 9.04933L24.2611 9.06697L23.265 12.7584L23.2604 12.7762C23.1667 13.161 23.3966 13.5526 23.7813 13.6563C24.1659 13.7602 24.5617 13.5375 24.6743 13.1577L24.6792 13.1401L25.6753 9.44865L25.6799 9.43084C25.7736 9.04599 25.5436 8.65447 25.159 8.5507Z"
        fill="white"
      />
      <path
        d="M7.51285 5.04065C7.12824 4.93682 6.73249 5.15948 6.61988 5.53929L6.61495 5.55692L5.61886 9.24833L5.61429 9.26614C5.52054 9.65098 5.75052 10.0425 6.13519 10.1463C6.5198 10.2501 6.91554 10.0274 7.02816 9.64764L7.03308 9.63001L8.02917 5.9386L8.03374 5.92079C8.12749 5.53595 7.89751 5.14442 7.51285 5.04065ZM20.3116 5.73845C19.9269 5.63462 19.5312 5.85727 19.4186 6.23708L19.4136 6.25471L18.7443 8.73499C19.1779 8.94915 19.5917 9.20126 19.9809 9.48839L20.0453 9.53643L20.8279 6.63639L20.8324 6.61858C20.9262 6.23374 20.6963 5.84221 20.3116 5.73845ZM13.7968 1.57642C13.3296 1.61771 12.8647 1.68338 12.4043 1.77317L12.3066 1.79263L11.3782 5.23419L11.3736 5.252C11.2799 5.63684 11.5099 6.02837 11.8945 6.13214C12.2792 6.23596 12.6749 6.01331 12.7875 5.6335L12.7924 5.61587L13.7885 1.92446L13.7931 1.90665C13.8196 1.79831 13.8209 1.68533 13.7968 1.57642ZM22.9626 4.1263L22.7669 4.85169L22.7623 4.86944C22.6686 5.25429 22.8986 5.64581 23.2832 5.74958C23.6678 5.85341 24.0636 5.63075 24.1762 5.25095L24.1811 5.23331L24.2025 5.15462C23.8362 4.81205 23.4511 4.49009 23.0491 4.19022L22.9626 4.1263ZM17.1672 1.69677L16.8139 3.00593L16.8094 3.02374C16.7156 3.40858 16.9456 3.80011 17.3303 3.90388C17.7149 4.0077 18.1106 3.78505 18.2233 3.40524L18.2282 3.38761L18.6 2.00966C18.1624 1.88867 17.719 1.79001 17.2714 1.71405L17.1672 1.69677Z"
        fill="white"
      />
      <path
        d="M9.69085 24.6253C9.80341 24.2455 10.1992 24.0229 10.5838 24.1266C10.9685 24.2303 11.1984 24.6219 11.1047 25.0068L11.1001 25.0246L10.3872 27.6664L10.2876 27.6297C9.85836 27.4694 9.43765 27.2873 9.0271 27.0839L9.68587 24.6429L9.69085 24.6253Z"
        fill="white"
      />
      <path
        d="M14.4141 8.49082C10.0522 8.49082 6.65918 11.2368 6.65918 14.6517C6.65918 17.8769 9.78123 19.9362 14.6211 19.8331C15.0327 19.8243 15.1517 20.1008 15.2856 20.4734C15.4196 20.846 15.7796 22.8097 16.0665 24.3117C16.3233 25.656 16.5842 27.0052 16.7834 28.3596C19.9439 27.9418 22.8663 26.3807 25.0076 24.0261L22.7237 15.5088C22.1544 13.4518 21.489 11.5564 19.7283 10.1794C18.3118 9.07166 16.5122 8.49082 14.4141 8.49082Z"
        fill="white"
      />
      <path
        d="M15.3516 10.957C15.8694 10.957 16.2891 11.3767 16.2891 11.8945C16.2891 12.4123 15.8694 12.832 15.3516 12.832C14.8338 12.832 14.4141 12.4123 14.4141 11.8945C14.4141 11.3767 14.8338 10.957 15.3516 10.957Z"
        fill="#232323"
      />
    </svg>
  );
}

export function Deno(props: { class?: string }) {
  return (
    <svg
      class={tw(props.class ?? "")}
      width="41"
      height="12"
      viewBox="0 0 41 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.784546 11.4113V0.400024H5.07893C6.78829 0.400024 8.18829 0.924369 9.27893 1.97306C10.3801 3.01126 10.9306 4.31163 10.9306 5.87418V5.90564C10.9306 7.47868 10.3801 8.78954 9.27893 9.83823C8.18829 10.8869 6.78829 11.4113 5.07893 11.4113H0.784546ZM3.20702 9.22474H5.07893C6.0647 9.22474 6.8617 8.92062 7.46994 8.31238C8.08867 7.70414 8.39803 6.91238 8.39803 5.9371V5.90564C8.39803 4.93036 8.08867 4.13336 7.46994 3.51463C6.8617 2.89591 6.0647 2.58654 5.07893 2.58654H3.20702V9.22474Z"
        fill="currentColor"
      />
      <path
        d="M16.8331 11.6C15.5537 11.6 14.4997 11.1963 13.6713 10.3888C12.8428 9.57081 12.4286 8.52212 12.4286 7.24272V7.21126C12.4286 5.98429 12.8218 4.94609 13.6083 4.09665C14.3949 3.24722 15.3911 2.8225 16.5971 2.8225C17.9289 2.8225 18.9462 3.26295 19.6488 4.14385C20.3514 5.02474 20.7027 6.11014 20.7027 7.40002C20.7027 7.52587 20.6922 7.73561 20.6713 8.02924H14.8038C14.9192 8.56407 15.1552 8.97306 15.5117 9.25621C15.8683 9.53935 16.3192 9.68092 16.8645 9.68092C17.6091 9.68092 18.2907 9.39253 18.9095 8.81576L20.278 10.027C19.4286 11.0757 18.2802 11.6 16.8331 11.6ZM14.7724 6.53486H18.3746C18.3012 5.98954 18.1072 5.55433 17.7926 5.22924C17.4885 4.90414 17.09 4.7416 16.5971 4.7416C16.1147 4.7416 15.711 4.90414 15.3859 5.22924C15.0713 5.54385 14.8668 5.97905 14.7724 6.53486Z"
        fill="currentColor"
      />
      <path
        d="M22.4847 11.4113V2.9798H24.8757V4.17531C25.5783 3.27343 26.4015 2.8225 27.3453 2.8225C28.2472 2.8225 28.9498 3.1004 29.4532 3.6562C29.9566 4.21201 30.2083 4.97755 30.2083 5.95283V11.4113H27.8173V6.70789C27.8173 6.15208 27.6914 5.72737 27.4397 5.43373C27.188 5.1401 26.8315 4.99328 26.3701 4.99328C25.9086 4.99328 25.5416 5.1401 25.2689 5.43373C25.0068 5.72737 24.8757 6.15208 24.8757 6.70789V11.4113H22.4847Z"
        fill="currentColor"
      />
      <path
        d="M39.6787 10.3259C38.8083 11.1753 37.7229 11.6 36.4225 11.6C35.1221 11.6 34.0367 11.1805 33.1663 10.3416C32.3064 9.49216 31.8764 8.4592 31.8764 7.24272V7.21126C31.8764 5.98429 32.3116 4.94609 33.182 4.09665C34.0629 3.24722 35.1536 2.8225 36.4539 2.8225C37.7543 2.8225 38.8345 3.24722 39.6944 4.09665C40.5648 4.93561 41 5.96332 41 7.1798V7.21126C41 8.43823 40.5596 9.47643 39.6787 10.3259ZM36.4539 9.53935C37.1146 9.53935 37.6442 9.31913 38.0427 8.87868C38.4412 8.43823 38.6405 7.89291 38.6405 7.24272V7.21126C38.6405 6.57156 38.4307 6.02624 38.0113 5.57531C37.6023 5.11388 37.0727 4.88317 36.4225 4.88317C35.7618 4.88317 35.2322 5.1034 34.8337 5.54385C34.4352 5.98429 34.236 6.52961 34.236 7.1798V7.21126C34.236 7.85096 34.4405 8.40152 34.8495 8.86295C35.2689 9.31388 35.8038 9.53935 36.4539 9.53935Z"
        fill="currentColor"
      />
    </svg>
  );
}
