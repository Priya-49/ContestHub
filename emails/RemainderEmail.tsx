import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components';

export default function ReminderEmail({
  contestName,
  contestDate,
  contestTime,
  notifyBefore,
  contestUrl,
}: {
  contestName: string;
  contestDate: string;
  contestTime: string;
  notifyBefore: string;
  contestUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <Heading style={{ color: '#0056b3' }}>⏰ ContestHub Reminder!</Heading>
          <Text>Hi there!</Text>
          <Text>
            This is a reminder that the contest <strong>{contestName}</strong> is scheduled to begin soon.
          </Text>
          <Text>
            <strong>Date:</strong> {contestDate}
            <br />
            <strong>Time:</strong> {contestTime}
            <br />
            <strong>Reminder Set For:</strong> {notifyBefore} before start
          </Text>
          <Button
            href={contestUrl}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              textDecoration: 'none',
              marginTop: '10px',
              display: 'inline-block',
            }}
          >
            Go to Contest
          </Button>
          <Text style={{ marginTop: '20px' }}>Good luck! 🚀</Text>
          <Text style={{ fontSize: '12px', color: '#888' }}>
            This is an automated email from ContestHub. Please do not reply.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
