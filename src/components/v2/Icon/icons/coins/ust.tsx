import * as React from 'react';
import { SVGProps } from 'react';

const SvgUst = ({ id, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
      fill="#F3F4F5"
    />
    <path
      d="M10.72 14.92c.319 1.183 1.466 2.085 2.046 2.048.02-.002 2.197-.407 3.389-2.398.927-1.55.612-3.046-.65-3.079-.454.033-5.395 1.175-4.786 3.429Zm4.668-7.599h-.002l.002-.002a5.537 5.537 0 0 0-6.187-.67c-.078.041-.156.082-.231.128l.018.006c-.223.151-.42.338-.584.553-1.588 2.099 3.738 3.625 6.586 3.63 1.31.94 1.678-2.648.398-3.645Z"
      fill="#0E3CA5"
    />
    <path
      d="M9.874 7.364c-.732 1.1-3.169 1.875-3.57 1.754l-.002-.005.05-.1a5.864 5.864 0 0 1 2.203-2.335c.247-.137.524-.21.806-.215 1.085.02.519.892.513.901Zm-.6 7.772c.052.345-.002 1.71-.072 1.825-.061.004-.188.012-.555-.194a5.842 5.842 0 0 1-2.588-7.09c.42.559.907 1.065 1.321 1.63.394.538.936 1.415 1.047 1.603.685 1.163.794 1.881.846 2.226Zm8.097-3.44c0 .733-.137 1.46-.406 2.143-.688.738-5.322-1.08-5.367-1.1-.634-.278-2.563-1.123-2.737-2.45-.25-1.91 3.624-3.24 5.327-3.291.204.002.825.01 1.187.304a5.822 5.822 0 0 1 1.996 4.393Zm-3.137 5.175c-.505.236-1.062.064-.917-.428.277-.945 2.7-1.913 3.235-1.966.066-.007.094.038.064.09a5.892 5.892 0 0 1-2.382 2.303"
      fill="#5493F7"
    />
    <path
      d="M8.281 17.797a.408.408 0 0 0 .373.433c4.908.034 9.646-.192 9.646-.927 0-2.226-10.019.494-10.019.494Z"
      fill={`url(#${id}__a`}
    />
    <path
      d="M8.281 17.797a.408.408 0 0 0 .374.433c4.907.037 9.639-.117 9.644-.927 0-2.226-10.018.494-10.018.494Zm.374.405c-.013 0-.026 0-.039-.002a.383.383 0 0 1-.186-.082.38.38 0 0 0 .225.082c4.903-.031 9.568-1.541 9.568-.876 0 .678-4.664.911-9.568.878Z"
      fill={`url(#${id}__b`}
    />
    <path
      d="M8.656 11.492a.375.375 0 0 0-.375.375v5.93a.375.375 0 0 0 .372.374c4.908-.036 9.652-1.66 9.647-.868v-6.679c.005-.793-4.737.832-9.644.868Z"
      fill={`url(#${id}__c`}
    />
    <path
      d="M9.38 15.585a31.558 31.558 0 0 0 1.008-.056 56.352 56.352 0 0 0 1.393-.132 46.335 46.335 0 0 0 1.31-.168c.143-.02.285-.043.428-.065l.432-.067.434-.07.44-.076.45-.078c.152-.026.306-.052.461-.08l.475-.082a32.593 32.593 0 0 1 1.019-.153c.226-.032.455-.044.684-.037.215.015.385.07.385.22v-.514c0-.149-.163-.202-.363-.218a3.444 3.444 0 0 0-.64.027c-.2.023-.343.045-.494.067a28.564 28.564 0 0 0-.868.141l-.423.075-.428.074-.443.076a54.729 54.729 0 0 1-.963.157l-.54.083v-.514l.54-.083a79.719 79.719 0 0 0 .963-.157l.443-.076.428-.074.423-.075.427-.072.441-.07c.15-.021.295-.043.494-.066.212-.029.426-.038.64-.027.2.016.363.07.363.218v-.514c0-.147-.163-.2-.363-.217a3.506 3.506 0 0 0-.64.027c-.2.023-.343.044-.493.066a29.407 29.407 0 0 0-.869.142l-.422.074-.429.075-.442.076a41.249 41.249 0 0 1-.964.156l-.54.083v-.513l.54-.083c.173-.028.34-.053.5-.08.16-.025.314-.051.464-.077l.442-.076.429-.074.422-.075c.29-.05.579-.098.869-.141.15-.022.294-.044.494-.067.212-.029.426-.038.64-.027.2.016.363.07.363.218v-.515c0-.148-.164-.2-.364-.217a3.48 3.48 0 0 0-.64.027 28.362 28.362 0 0 0-1.362.208l-.422.075-.429.074-.442.076a35.097 35.097 0 0 1-.964.156c-.173.027-.353.056-.54.083v-.513c.187-.028.366-.057.54-.084a72.47 72.47 0 0 0 .964-.156l.442-.076.429-.074.422-.075a39.025 39.025 0 0 1 .869-.141c.15-.022.294-.044.494-.067.212-.029.426-.038.64-.027.2.016.363.07.363.217v-.513c0-.148-.163-.201-.364-.218a3.506 3.506 0 0 0-.64.027c-.199.023-.343.045-.493.067a29.407 29.407 0 0 0-.868.142l-.423.074-.428.074-.443.076c-.32.056-.642.108-.964.157l-.54.083v-.521c-1.484.232-2.98.361-4.482.387a.375.375 0 0 0-.374.375v3.741a25.62 25.62 0 0 0 1.098-.023Z"
      fill={`url(#${id}__d`}
    />
    <path
      d="M9.378 16.613a31.404 31.404 0 0 0 1.01-.056 45.374 45.374 0 0 0 1.393-.132 50.645 50.645 0 0 0 1.31-.168c.143-.02.285-.043.428-.066l.432-.066.435-.071.44-.075.45-.078c.151-.026.305-.052.46-.08l.475-.082a31.37 31.37 0 0 1 1.02-.153c.226-.033.455-.045.683-.037.215.015.386.07.386.22v-.515c0-.15-.17-.205-.385-.22a3.887 3.887 0 0 0-.685.037c-.209.026-.36.05-.527.074a30.612 30.612 0 0 0-.966.162l-.461.08-.45.077-.44.075c-.145.025-.29.049-.435.07l-.432.068a42.941 42.941 0 0 1-1.296.181 34.79 34.79 0 0 1-.442.053l-.452.048a28.081 28.081 0 0 1-3.049.162v.513a32.41 32.41 0 0 0 1.098-.021Z"
      fill={`url(#${id}__e`}
    />
    <path
      d="M17.914 16.062a3.894 3.894 0 0 0-.684.037 33.004 33.004 0 0 0-1.493.236l-.461.08-.45.076c-.149.026-.295.052-.44.076-.146.024-.29.048-.435.07l-.432.067-.429.066-.432.06c-.292.039-.585.075-.877.108-.15.017-.3.032-.452.048a29.437 29.437 0 0 1-1.437.116c-.537.03-1.074.045-1.612.046v.515c.192 0 .379-.002.561-.006a40.058 40.058 0 0 0 1.051-.04 29.867 29.867 0 0 0 1.437-.116 32.778 32.778 0 0 0 .893-.1c.146-.018.292-.036.436-.056l.432-.06c.144-.02.286-.043.429-.065a89.143 89.143 0 0 0 .866-.138l.44-.075.45-.078.462-.08.474-.082a31.739 31.739 0 0 1 1.02-.153c.226-.032.455-.044.683-.037.215.015.386.07.386.22v-.516c0-.15-.17-.204-.386-.219Z"
      fill={`url(#${id}__f`}
    />
    <path
      d="M9.346 15.072a29.941 29.941 0 0 0 1.364-.083 47.349 47.349 0 0 0 1.362-.14 53.815 53.815 0 0 0 1.064-.14v-3.604a32.58 32.58 0 0 1-4.48.387.375.375 0 0 0-.375.375v3.227a24.562 24.562 0 0 0 1.065-.021Z"
      fill={`url(#${id}__g`}
    />
    <path
      d="m9.437 11.644-.046.144-.147.005.12.084-.047.144.12-.092c.048.033.071.05.12.082-.02-.055-.028-.083-.046-.14l.12-.093-.149.007-.045-.141Z"
      fill={`url(#${id}__h`}
    />
    <path
      d="m9.864 13.416-.046.145-.148.007.12.082-.046.144.12-.094.12.081-.046-.14.12-.094-.148.008-.046-.139Z"
      fill={`url(#${id}__i`}
    />
    <path
      d="m9.91 14.273-.046-.14-.046.145-.148.008.12.082a20.85 20.85 0 0 1-.046.143l.12-.094c.048.032.072.05.12.081l-.046-.139.12-.095-.148.01Z"
      fill={`url(#${id}__j`}
    />
    <path
      d="m9.437 13.078-.046.144-.147.005.119.083-.045.144.119-.092.12.083a19.854 19.854 0 0 1-.046-.14l.12-.093-.148.006-.046-.14Z"
      fill={`url(#${id}__k`}
    />
    <path
      d="m9.437 13.795-.046.144-.148.005.12.084-.046.143.12-.092.12.083a21.667 21.667 0 0 1-.046-.14c.048-.038.071-.057.12-.094l-.149.006-.045-.14Z"
      fill={`url(#${id}__l`}
    />
    <path
      d="m9.437 12.36-.046.145-.147.005.12.084-.046.144.12-.093.119.083-.046-.14.12-.093-.148.006-.046-.14Z"
      fill={`url(#${id}__m`}
    />
    <path
      d="m10.718 14.073-.045.146-.148.012c.048.032.072.048.12.078l-.046.146.12-.098.119.078-.046-.139.12-.098-.148.013-.046-.138Z"
      fill={`url(#${id}__n`}
    />
    <path
      d="m9.864 12.7-.046.144-.148.007.12.082-.046.145.12-.094.12.08-.046-.139.12-.095-.148.009-.046-.14Z"
      fill={`url(#${id}__o`}
    />
    <path
      d="m10.292 13.748-.046.146-.148.009.12.08-.046.145.12-.096.12.079-.046-.139.12-.097-.148.011a9.71 9.71 0 0 1-.046-.138Z"
      fill={`url(#${id}__p`}
    />
    <path
      d="m10.338 14.604-.046-.139-.046.146-.148.01.12.08-.045.145c.047-.039.071-.058.12-.096.047.032.071.048.12.079l-.047-.139a22 22 0 0 0 .12-.097l-.148.011Z"
      fill={`url(#${id}__q`}
    />
    <path
      d="m9.864 11.982-.046.144-.148.008.12.082a19.25 19.25 0 0 1-.046.144l.12-.095.12.082-.046-.14.12-.095-.148.009-.046-.139Z"
      fill={`url(#${id}__r`}
    />
    <path
      d="m10.292 13.031-.046.146c-.06.003-.088.006-.148.01l.12.08-.046.144.12-.095.12.079-.046-.14.12-.095-.148.01-.046-.139Z"
      fill={`url(#${id}__s`}
    />
    <path
      d="m9.482 14.652-.045-.14-.046.144-.148.006.12.083-.046.144.12-.093.12.084-.046-.14.12-.094-.149.006Z"
      fill={`url(#${id}__t`}
    />
    <path
      d="m8.582 13.101-.046.143h-.148l.12.088-.046.143.12-.09.12.086-.046-.141.12-.09-.148.003-.046-.142Z"
      fill={`url(#${id}__u`}
    />
    <path
      d="m8.582 12.384-.046.142-.148.001.12.087-.046.143.12-.089.12.086-.046-.142.12-.09-.148.003-.046-.141Z"
      fill={`url(#${id}__v`}
    />
    <path
      d="m8.627 14.677-.046-.142-.046.143-.148.001.12.087-.046.143.12-.09.12.087a42.66 42.66 0 0 1-.046-.142l.12-.09-.148.003Z"
      fill={`url(#${id}__w`}
    />
    <path
      d="m10.172 12.695.12-.096.12.079-.046-.14.12-.096-.148.011-.046-.138-.046.145c-.059.004-.089.005-.148.01l.12.08-.046.145Z"
      fill={`url(#${id}__x`}
    />
    <path
      d="m10.172 11.977.12-.096.12.08-.046-.14.12-.096-.148.01-.046-.138-.046.145-.148.01.12.08-.046.145Z"
      fill={`url(#${id}__y`}
    />
    <path
      d="m8.582 13.818-.046.143h-.148l.12.088-.046.142.12-.09.12.087-.046-.142.12-.09-.148.003-.046-.14Z"
      fill={`url(#${id}__z`}
    />
    <path
      d="m9.01 12.016-.046.143-.148.004.12.085-.046.144.12-.091.12.084-.046-.14.12-.092-.148.004a23.221 23.221 0 0 1-.046-.14Z"
      fill={`url(#${id}__A`}
    />
    <path
      d="m9.01 12.734-.046.143-.148.004.12.085-.046.144.12-.091.12.084-.046-.14.12-.092-.149.004-.045-.141Z"
      fill={`url(#${id}__B`}
    />
    <path
      d="m9.055 14.309-.045-.141-.046.144-.149.003.12.085-.045.144.12-.09.12.084-.046-.141.12-.092-.149.004Z"
      fill={`url(#${id}__C`}
    />
    <path
      d="m9.01 13.45-.046.145-.148.003.12.085a22.74 22.74 0 0 0-.046.144l.12-.091.12.084-.047-.14.12-.092-.148.005-.046-.142Z"
      fill={`url(#${id}__D`}
    />
    <path
      d="m8.582 11.667-.046.143h-.148l.12.088-.046.142.12-.089.12.086-.046-.141.12-.09-.148.002-.046-.141Z"
      fill={`url(#${id}__E`}
    />
    <path
      d="m10.718 13.356-.045.146-.148.012.12.078-.046.146.12-.098.119.077-.046-.138.12-.098-.148.013-.046-.138Z"
      fill={`url(#${id}__F`}
    />
    <path
      d="m12.427 13.173-.046.148-.148.018.12.073-.046.148.12-.103.12.073-.046-.136.12-.104-.148.02-.046-.137Z"
      fill={`url(#${id}__G`}
    />
    <path
      d="m12.427 12.456-.046.148-.148.018.12.074-.046.147.12-.103.12.073-.046-.136.12-.104-.148.02-.046-.137Z"
      fill={`url(#${id}__H`}
    />
    <path
      d="m12.473 14.026-.046-.136-.046.148-.148.018.12.073-.046.148.12-.103.12.073-.046-.136.12-.104-.148.02Z"
      fill={`url(#${id}__I`}
    />
    <path
      d="M12 12.15c-.017.059-.026.088-.045.147l-.147.018.12.074-.046.147.119-.102.12.074-.047-.137.12-.102-.148.018a5.095 5.095 0 0 1-.045-.137Z"
      fill={`url(#${id}__J`}
    />
    <path
      d="m12.427 11.739-.046.147-.148.019.12.073-.046.148.12-.103.12.072-.046-.136c.048-.04.072-.062.12-.104l-.148.02-.046-.136Z"
      fill={`url(#${id}__K`}
    />
    <path
      d="M12 11.433c-.017.059-.026.089-.045.148l-.147.017.12.073-.046.148.119-.102.12.073-.046-.136c.048-.041.071-.062.12-.102l-.149.018a6.078 6.078 0 0 1-.045-.137Z"
      fill={`url(#${id}__L`}
    />
    <path
      d="m12.855 12.758-.046.148-.148.02.12.072-.046.148.12-.104.12.071c-.02-.054-.028-.081-.046-.136l.119-.104-.148.02-.045-.135Z"
      fill={`url(#${id}__M`}
    />
    <path
      d="m12.855 12.04-.046.149-.148.02.12.072-.046.148.12-.104.12.071c-.02-.054-.028-.082-.046-.136l.119-.105-.147.021-.046-.135Z"
      fill={`url(#${id}__N`}
    />
    <path
      d="m12.9 14.328-.046-.136-.046.148-.147.02.12.072-.047.149.12-.105.12.072-.046-.136.12-.105c-.06.008-.088.013-.148.02Z"
      fill={`url(#${id}__O`}
    />
    <path
      d="m12.855 11.323-.046.149-.148.02.12.071-.046.149.12-.104.12.07-.046-.135.12-.105a11.86 11.86 0 0 1-.148.021l-.046-.136Z"
      fill={`url(#${id}__P`}
    />
    <path
      d="m12.855 13.475-.046.148-.148.02.12.072-.046.148.12-.104.119.071-.046-.136.12-.105c-.06.01-.089.013-.148.021l-.045-.135Z"
      fill={`url(#${id}__Q`}
    />
    <path
      d="M12 12.867c-.017.06-.026.089-.045.148l-.147.017.12.074-.046.147.119-.102.12.074-.046-.137.12-.102-.149.018-.045-.137Z"
      fill={`url(#${id}__R`}
    />
    <path
      d="m10.718 11.922-.045.145-.148.013.12.078-.046.146.12-.098c.047.032.071.046.119.077l-.046-.138.12-.099-.148.014-.046-.138Z"
      fill={`url(#${id}__S`}
    />
    <path
      d="m11.146 13.675-.046.147-.148.014.12.076-.046.147.12-.1.12.077-.046-.138.12-.1-.149.015-.045-.138Z"
      fill={`url(#${id}__T`}
    />
    <path
      d="m12 13.584-.045.148-.147.017.12.074-.046.147.119-.102.12.074-.046-.137.12-.102-.149.018a5.473 5.473 0 0 1-.045-.137Z"
      fill={`url(#${id}__U`}
    />
    <path
      d="m11.146 12.241-.046.146-.148.014.12.077-.046.147.12-.1.12.077-.046-.138.12-.1-.149.015-.045-.138Z"
      fill={`url(#${id}__V`}
    />
    <path
      d="m11.146 14.393-.046.146-.148.014.12.076-.046.147.12-.1.12.077-.046-.138.12-.1-.149.015-.045-.137Z"
      fill={`url(#${id}__W`}
    />
    <path
      d="m10.718 12.64-.045.146-.148.012c.048.032.071.048.12.078l-.046.146.12-.098c.047.031.07.047.119.077l-.046-.138.12-.098-.148.013-.046-.138Z"
      fill={`url(#${id}__X`}
    />
    <path
      d="m11.146 11.524-.046.147-.148.013.12.077-.046.146.12-.099.12.076-.046-.137.12-.1-.149.015-.045-.138Z"
      fill={`url(#${id}__Y`}
    />
    <path
      d="m11.146 12.958-.046.147-.148.014.12.077-.046.147.12-.1.12.076-.046-.137.12-.1-.149.015-.045-.139Z"
      fill={`url(#${id}__Z`}
    />
    <path
      d="M12.045 14.438 12 14.302l-.046.147-.147.017.12.074-.046.148.119-.102.12.073-.046-.136.12-.103-.149.018Z"
      fill={`url(#${id}__aa`}
    />
    <path
      d="m11.62 14.128-.046-.137-.046.147-.148.016.12.076-.046.146.12-.1.12.075-.046-.137.12-.101c-.06.005-.09.009-.149.015Z"
      fill={`url(#${id}__ab`}
    />
    <path
      d="m11.574 11.84-.046.146-.148.016.12.076-.046.147.12-.1.12.074-.046-.137.12-.1-.149.015-.045-.138Z"
      fill={`url(#${id}__ac`}
    />
    <path
      d="m11.574 13.274-.046.147-.148.016.12.075-.046.147.12-.1.12.074-.046-.136.12-.102-.149.016-.045-.137Z"
      fill={`url(#${id}__ad`}
    />
    <path
      d="m11.574 12.556-.046.148-.148.015.12.075-.046.147.12-.1.12.075-.046-.137.12-.102-.149.016-.045-.137Z"
      fill={`url(#${id}__ae`}
    />
    <defs>
      <linearGradient
        id={`${id}__a`}
        x1={8.281}
        y1={17.33}
        x2={18.3}
        y2={17.33}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#600000" />
        <stop offset={0.327} stopColor="#630000" />
        <stop offset={0.59} stopColor="#6D0000" />
        <stop offset={0.83} stopColor="#7E0000" />
        <stop offset={1} stopColor="#8F0000" />
      </linearGradient>
      <linearGradient
        id={`${id}__b`}
        x1={13.29}
        y1={16.427}
        x2={13.29}
        y2={18.235}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.35} stopColor="#BF1010" />
        <stop offset={0.645} stopColor="#BD1010" />
        <stop offset={0.752} stopColor="#B60F0F" />
        <stop offset={0.828} stopColor="#AB0D0D" />
        <stop offset={0.889} stopColor="#9A0A0A" />
        <stop offset={0.941} stopColor="#840606" />
        <stop offset={0.987} stopColor="#690202" />
        <stop offset={1} stopColor="#600000" />
      </linearGradient>
      <linearGradient
        id={`${id}__c`}
        x1={8.281}
        y1={14.289}
        x2={18.3}
        y2={14.289}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BF1010" />
        <stop offset={0.021} stopColor="#C11212" />
        <stop offset={0.244} stopColor="#D22323" />
        <stop offset={0.487} stopColor="#DC2D2D" />
        <stop offset={0.791} stopColor="#DF3030" />
        <stop offset={0.841} stopColor="#DC2E2E" />
        <stop offset={0.882} stopColor="#D22626" />
        <stop offset={0.919} stopColor="#C11919" />
        <stop offset={0.954} stopColor="#A90808" />
        <stop offset={0.966} stopColor="#9F0000" />
        <stop offset={1} stopColor="#DF3030" />
      </linearGradient>
      <linearGradient
        id={`${id}__d`}
        x1={8.281}
        y1={13.264}
        x2={18.299}
        y2={13.264}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__e`}
        x1={8.281}
        y1={15.833}
        x2={18.3}
        y2={15.833}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__f`}
        x1={8.281}
        y1={16.86}
        x2={18.3}
        y2={16.86}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__g`}
        x1={8.281}
        y1={13.1}
        x2={18.299}
        y2={13.1}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00209F" />
        <stop offset={0.021} stopColor="#0222A1" />
        <stop offset={0.244} stopColor="#1333B2" />
        <stop offset={0.487} stopColor="#1D3DBC" />
        <stop offset={0.791} stopColor="#2040BF" />
        <stop offset={0.841} stopColor="#1E3DBC" />
        <stop offset={0.882} stopColor="#1933B2" />
        <stop offset={0.919} stopColor="#1122A1" />
        <stop offset={0.954} stopColor="#050A89" />
        <stop offset={0.966} stopColor="#00007F" />
        <stop offset={1} stopColor="#2040BF" />
      </linearGradient>
      <linearGradient
        id={`${id}__h`}
        x1={8.281}
        y1={11.832}
        x2={18.299}
        y2={11.832}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__i`}
        x1={8.281}
        y1={13.606}
        x2={18.299}
        y2={13.606}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__j`}
        x1={8.281}
        y1={14.323}
        x2={18.299}
        y2={14.323}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__k`}
        x1={8.281}
        y1={13.266}
        x2={18.299}
        y2={13.266}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__l`}
        x1={8.281}
        y1={13.983}
        x2={18.299}
        y2={13.983}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__m`}
        x1={8.281}
        y1={12.549}
        x2={18.299}
        y2={12.549}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__n`}
        x1={8.28}
        y1={14.264}
        x2={18.301}
        y2={14.264}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__o`}
        x1={8.281}
        y1={12.889}
        x2={18.299}
        y2={12.889}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__p`}
        x1={8.281}
        y1={13.938}
        x2={18.299}
        y2={13.938}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__q`}
        x1={8.282}
        y1={14.655}
        x2={18.299}
        y2={14.655}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__r`}
        x1={8.281}
        y1={12.171}
        x2={18.299}
        y2={12.171}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__s`}
        x1={8.282}
        y1={13.221}
        x2={18.299}
        y2={13.221}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__t`}
        x1={8.281}
        y1={14.701}
        x2={18.299}
        y2={14.701}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__u`}
        x1={8.281}
        y1={13.288}
        x2={18.301}
        y2={13.288}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__v`}
        x1={8.281}
        y1={12.57}
        x2={18.301}
        y2={12.57}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__w`}
        x1={8.281}
        y1={14.722}
        x2={18.298}
        y2={14.722}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__x`}
        x1={8.282}
        y1={12.505}
        x2={18.299}
        y2={12.505}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__y`}
        x1={8.282}
        y1={11.787}
        x2={18.299}
        y2={11.787}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__z`}
        x1={8.281}
        y1={14.005}
        x2={18.298}
        y2={14.005}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__A`}
        x1={8.281}
        y1={12.204}
        x2={18.298}
        y2={12.204}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__B`}
        x1={8.281}
        y1={12.921}
        x2={18.298}
        y2={12.921}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__C`}
        x1={8.281}
        y1={14.355}
        x2={18.298}
        y2={14.355}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__D`}
        x1={8.281}
        y1={13.639}
        x2={18.298}
        y2={13.639}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__E`}
        x1={8.281}
        y1={11.854}
        x2={18.301}
        y2={11.854}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__F`}
        x1={8.28}
        y1={13.547}
        x2={18.301}
        y2={13.547}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__G`}
        x1={8.282}
        y1={13.367}
        x2={18.299}
        y2={13.367}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__H`}
        x1={8.282}
        y1={12.65}
        x2={18.299}
        y2={12.65}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__I`}
        x1={8.282}
        y1={14.084}
        x2={18.299}
        y2={14.084}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__J`}
        x1={8.28}
        y1={12.343}
        x2={18.302}
        y2={12.343}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__K`}
        x1={8.282}
        y1={11.932}
        x2={18.299}
        y2={11.932}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__L`}
        x1={8.28}
        y1={11.626}
        x2={18.302}
        y2={11.626}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__M`}
        x1={8.281}
        y1={12.952}
        x2={18.299}
        y2={12.952}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__N`}
        x1={8.281}
        y1={12.235}
        x2={18.299}
        y2={12.235}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__O`}
        x1={8.281}
        y1={14.386}
        x2={18.299}
        y2={14.386}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__P`}
        x1={8.281}
        y1={11.518}
        x2={18.299}
        y2={11.518}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__Q`}
        x1={8.281}
        y1={13.669}
        x2={18.299}
        y2={13.669}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__R`}
        x1={8.28}
        y1={13.06}
        x2={18.302}
        y2={13.06}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__S`}
        x1={8.28}
        y1={12.113}
        x2={18.301}
        y2={12.113}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__T`}
        x1={8.281}
        y1={13.867}
        x2={18.299}
        y2={13.867}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__U`}
        x1={8.28}
        y1={13.777}
        x2={18.302}
        y2={13.777}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__V`}
        x1={8.281}
        y1={12.433}
        x2={18.299}
        y2={12.433}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__W`}
        x1={8.281}
        y1={14.584}
        x2={18.299}
        y2={14.584}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__X`}
        x1={8.28}
        y1={12.83}
        x2={18.301}
        y2={12.83}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__Y`}
        x1={8.281}
        y1={11.716}
        x2={18.3}
        y2={11.716}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__Z`}
        x1={8.281}
        y1={13.15}
        x2={18.299}
        y2={13.15}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__aa`}
        x1={8.28}
        y1={14.495}
        x2={18.302}
        y2={14.495}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__ab`}
        x1={8.282}
        y1={14.183}
        x2={18.299}
        y2={14.183}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__ac`}
        x1={8.282}
        y1={12.032}
        x2={18.299}
        y2={12.032}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__ad`}
        x1={8.282}
        y1={13.466}
        x2={18.299}
        y2={13.466}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={`${id}__ae`}
        x1={8.282}
        y1={12.749}
        x2={18.299}
        y2={12.749}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DFDFDF" />
        <stop offset={0.021} stopColor="#E1E1E1" />
        <stop offset={0.244} stopColor="#F2F2F2" />
        <stop offset={0.487} stopColor="#FCFCFC" />
        <stop offset={0.791} stopColor="#fff" />
        <stop offset={0.841} stopColor="#FCFCFC" />
        <stop offset={0.882} stopColor="#F2F2F2" />
        <stop offset={0.919} stopColor="#E1E1E1" />
        <stop offset={0.954} stopColor="#C9C9C9" />
        <stop offset={0.966} stopColor="#BFBFBF" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgUst;
