import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQs = () => {
  const faqs = [
    {
      question: "What is SkillBridge?",
      answer: "SkillBridge is a platform that connects skilled volunteers with NGOs, making it easier for professionals to contribute their expertise to meaningful causes while helping organizations access the talent they need."
    },
    {
      question: "How can I register as a volunteer?",
      answer: "To register as a volunteer, click on the 'Register' button and select 'Volunteer'. Fill in your details, including your skills and areas of expertise, and create your account. Once registered, you can browse and apply for volunteer opportunities."
    },
    {
      question: "How can NGOs join SkillBridge?",
      answer: "NGOs can register by clicking the 'Register' button and selecting 'NGO'. You'll need to provide your organization details, registration documents, and create your profile. Once verified, you can start posting volunteer opportunities."
    },
    {
      question: "What types of volunteering opportunities are available?",
      answer: "We offer a wide range of opportunities across different sectors including technology, education, healthcare, environmental conservation, and more. Opportunities can be remote or in-person, depending on the project requirements."
    },
    {
      question: "How long do volunteer commitments typically last?",
      answer: "The duration varies by project. Some opportunities might be one-time events, while others could be ongoing commitments. The time requirement is clearly specified in each opportunity listing."
    },
    {
      question: "Is volunteering through SkillBridge free?",
      answer: "Yes, SkillBridge is completely free for both volunteers and NGOs. Our mission is to facilitate meaningful connections without any financial barriers."
    },
    {
      question: "How are NGOs verified?",
      answer: "We verify NGOs through a thorough process that includes checking registration documents, past work, and references. This helps ensure the legitimacy of organizations on our platform."
    },
    {
      question: "Can I volunteer remotely?",
      answer: "Yes, many opportunities on SkillBridge can be completed remotely. You can filter opportunities based on location preference (remote or in-person)."
    },
    {
      question: "What happens after I apply for an opportunity?",
      answer: "After applying, the NGO will review your application and respond through our platform. If selected, you'll receive further details about the project and next steps."
    },
    {
      question: "How can I track my volunteer hours?",
      answer: "Once you start volunteering, you can log your hours through our platform. This helps track your impact and can be used for your personal volunteer record."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Find answers to common questions about SkillBridge
        </Typography>
      </Box>

      {/* FAQs Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Additional Help Section */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Still have questions?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Contact our support team through the Contact Us page, and we'll be happy to help!
        </Typography>
      </Box>
    </Container>
  );
};

export default FAQs;