interface I_FooterProps {
    companyName: string
    copyright: string
}

export const Footer = ({ companyName, copyright }: I_FooterProps) => {
    return (
        <div className="footer-wrapper">
            <h3 className="footer-company-name">{companyName}</h3>
            <p className="footer-copyright">{copyright}</p>
        </div>
    )
}
