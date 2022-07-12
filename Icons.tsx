// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { runtime } from "./services.ts";
import { tw } from "./deps.ts";

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

export function SourceFile(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      class={tw`${props.class ?? ""}`}
    >
      <path
        d="M2.66699 14.1667H12.0003C12.3539 14.1667 12.6931 14.0262 12.9431 13.7762C13.1932 13.5261 13.3337 13.187 13.3337 12.8333V4.50001L9.66699 0.833344H4.00033C3.6467 0.833344 3.30756 0.973819 3.05752 1.22387C2.80747 1.47392 2.66699 1.81305 2.66699 2.16668V4.83334"
        stroke="#232323"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.00016 11.5L8.00016 9.50001L6.00016 7.50001M3.3335 7.50001L1.3335 9.50001L3.3335 11.5M9.3335 0.833344V4.83334H13.3335L9.3335 0.833344Z"
        stroke="#232323"
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
