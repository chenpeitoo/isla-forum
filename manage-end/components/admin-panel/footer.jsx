import Link from 'next/link'

export function Footer() {
  return (
    <div className="z-20 w-full bg-red-950/90 shadow backdrop-blur supports-[backdrop-filter]:bg-red-950/60">
      <div className="mx-4 md:mx-8 flex h-14 items-center justify-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-center text-white">
          © {new Date().getFullYear()} Taiwan ISLA Co., Ltd. All rights
          reserved.{' '}
        </p>
      </div>
    </div>
  )
}
