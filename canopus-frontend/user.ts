interface Address {
    city: string;
    state: string;
    country: string;
}
interface Certificate {
    url: string;
    organization: string;
    course: string;
    issuedDate: Date;
    credentialId: string;
}
interface Education {
    institute: string;
    startYear: Date;
    degree: string;
    endYear: Date;
}
interface user {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    address: Address;
    about: string;
    articles: string[];
    education: Education[];
    certificates: Certificate[];
    skills: string[];
}
