import { emailIcon, emailIconLight } from '@/app/assets/assets';
import ContactForm from '@/components/ContactForm/ContactForm';
import SectionHeading from '@/components/SectionHeading';

export default function ContactSection() {
  return (
    <>
      <SectionHeading
        darkImage={emailIcon}
        lightImage={emailIconLight}
        title='Contact'
        description='Feel free to reach out to me about any inquiries.'
      />

      <ContactForm />
    </>
  );
}
