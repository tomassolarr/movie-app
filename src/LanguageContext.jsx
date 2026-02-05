import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export function LanguageProvider(props) {
  const [language, setLanguage] = useState("es-CL")

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  return context
}
