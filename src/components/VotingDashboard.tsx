import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vote, Users, CheckCircle, LogOut, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  image?: string;
}

interface VotingDashboardProps {
  username: string;
  onLogout: () => void;
}

export const VotingDashboard = ({ username, onLogout }: VotingDashboardProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Load candidates from localStorage
    const storedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    setCandidates(storedCandidates);

    // Check if user has already voted
    const votedUsers = JSON.parse(localStorage.getItem('votedUsers') || '[]');
    setHasVoted(votedUsers.includes(username));

    // Load current votes
    const currentVotes = JSON.parse(localStorage.getItem('votes') || '{}');
    setVotes(currentVotes);

    // If no candidates exist, create default ones
    if (storedCandidates.length === 0) {
      const defaultCandidates: Candidate[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          party: 'Progressive Party',
          description: 'Advocating for education reform and environmental protection with 15 years of public service experience.'
        },
        {
          id: '2',
          name: 'Michael Chen',
          party: 'Economic Alliance',
          description: 'Focused on job creation and economic growth through innovation and small business support.'
        },
        {
          id: '3',
          name: 'Elena Rodriguez',
          party: 'Community First',
          description: 'Committed to healthcare accessibility and infrastructure development for all communities.'
        }
      ];
      localStorage.setItem('candidates', JSON.stringify(defaultCandidates));
      setCandidates(defaultCandidates);
    }
  }, [username]);

  const handleVote = (candidateId: string) => {
    if (hasVoted) return;
    setSelectedCandidate(candidateId);
    setShowConfirmDialog(true);
  };

  const confirmVote = () => {
    if (!selectedCandidate || hasVoted) return;

    // Update votes
    const currentVotes = JSON.parse(localStorage.getItem('votes') || '{}');
    currentVotes[selectedCandidate] = (currentVotes[selectedCandidate] || 0) + 1;
    localStorage.setItem('votes', JSON.stringify(currentVotes));

    // Mark user as voted
    const votedUsers = JSON.parse(localStorage.getItem('votedUsers') || '[]');
    votedUsers.push(username);
    localStorage.setItem('votedUsers', JSON.stringify(votedUsers));

    setVotes(currentVotes);
    setHasVoted(true);
    setShowConfirmDialog(false);
    setSelectedCandidate(null);

    toast({
      title: "Vote Submitted Successfully!",
      description: "Thank you for participating in the democratic process.",
    });
  };

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  const getVotePercentage = (candidateId: string) => {
    const candidateVotes = votes[candidateId] || 0;
    return totalVotes > 0 ? ((candidateVotes / totalVotes) * 100).toFixed(1) : '0';
  };

  const selectedCandidateData = candidates.find(c => c.id === selectedCandidate);

  return (
    <div className="min-h-screen bg-gradient-civic">
      {/* Header */}
      <div className="bg-gradient-primary shadow-civic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Vote className="h-8 w-8 text-primary-foreground" />
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">Democratic Voting System</h1>
                <p className="text-primary-foreground/80">Welcome, {username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {totalVotes} Total Votes
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResults(!showResults)}
                className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showResults ? 'Hide Results' : 'View Results'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasVoted && (
          <Alert className="mb-6 border-vote-success/20 bg-vote-success/10">
            <CheckCircle className="h-4 w-4 text-vote-success" />
            <AlertDescription className="text-vote-success font-medium">
              You have successfully voted in this election. Thank you for your participation!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => {
            const candidateVotes = votes[candidate.id] || 0;
            const percentage = getVotePercentage(candidate.id);

            return (
              <Card key={candidate.id} className="shadow-card bg-gradient-card border-0 transition-all duration-300 hover:shadow-vote">
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{candidate.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="mb-2">{candidate.party}</Badge>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {candidate.description}
                  </p>
                  
                  {showResults && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Votes: {candidateVotes}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleVote(candidate.id)}
                    disabled={hasVoted}
                    variant={hasVoted ? "secondary" : "vote"}
                    className="w-full"
                  >
                    {hasVoted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Voted
                      </>
                    ) : (
                      <>
                        <Vote className="w-4 h-4 mr-2" />
                        Vote for {candidate.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Your Vote</DialogTitle>
              <DialogDescription>
                Are you sure you want to vote for <strong>{selectedCandidateData?.name}</strong>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="vote" onClick={confirmVote}>
                Confirm Vote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};