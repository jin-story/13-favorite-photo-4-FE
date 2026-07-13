import React from 'react'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-[15px]">
      <div className="w-full max-w-[345px] tablet:max-w-[440px] pc:max-w-[520px]">
        {children}
      </div>
    </div>
  )
}
