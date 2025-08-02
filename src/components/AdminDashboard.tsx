import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Plus, Trash2, RotateCcw, Users, BarChart3, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
}

interface AdminDashboardProps {
  username: string;
  onLogout: () => void;
}

export const AdminDashboard = ({ username, onLogout }: AdminDashboardProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    description: ''
  });
  const [votedUsers, setVotedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const storedVotes = JSON.parse(localStorage.getItem('votes') || '{}');
    const storedVotedUsers = JSON.parse(localStorage.getItem('votedUsers') || '[]');
    
    setCandidates(storedCandidates);
    setVotes(storedVotes);
    setVotedUsers(storedVotedUsers);
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.party || !newCandidate.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all candidate details.",
        variant: "destructive"
      });
      return;
    }

    const candidate: Candidate = {
      id: Date.now().toString(),
      ...newCandidate
    };

    const updatedCandidates = [...candidates, candidate];
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));

    setNewCandidate({ name: '', party: '', description: '' });
    setShowAddDialog(false);

    toast({
      title: "Candidate Added",
      description: `${candidate.name} has been added to the election.`,
    });
  };

  const handleRemoveCandidate = (candidateId: string) => {
    const updatedCandidates = candidates.filter(c => c.id !== candidateId);
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));

    // Remove votes for this candidate
    const updatedVotes = { ...votes };
    delete updatedVotes[candidateId];
    setVotes(updatedVotes);
    localStorage.setItem('votes', JSON.stringify(updatedVotes));

    toast({
      title: "Candidate Removed",
      description: "The candidate has been removed from the election.",
    });
  };

  const handleResetElection = () => {
    if (window.confirm("Are you sure you want to reset the entire election? This will remove all votes and voter records.")) {
      localStorage.removeItem('votes');
      localStorage.removeItem('votedUsers');
      setVotes({});
      setVotedUsers([]);

      toast({
        title: "Election Reset",
        description: "All votes and voter records have been cleared.",
      });
    }
  };

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
  const totalVoters = votedUsers.length;

  const getVotePercentage = (candidateId: string) => {
    const candidateVotes = votes[candidateId] || 0;
    return totalVotes > 0 ? ((candidateVotes / totalVotes) * 100).toFixed(1) : '0';
  };

  const sortedCandidates = [...candidates].sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0));

  return (
    <div className="min-h-screen bg-gradient-civic">
      {/* Header */}
      <div className="bg-gradient-primary shadow-civic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-8 w-8 text-primary-foreground" />
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">Admin Dashboard</h1>
                <p className="text-primary-foreground/80">Welcome, {username}</p>
              </div>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVoters}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="civic" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
                <DialogDescription>
                  Enter the candidate's information below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                    placeholder="Enter candidate's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="party">Party/Affiliation</Label>
                  <Input
                    id="party"
                    value={newCandidate.party}
                    onChange={(e) => setNewCandidate({...newCandidate, party: e.target.value})}
                    placeholder="Enter party or affiliation"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCandidate.description}
                    onChange={(e) => setNewCandidate({...newCandidate, description: e.target.value})}
                    placeholder="Enter candidate's background and platform"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button variant="civic" onClick={handleAddCandidate}>
                  Add Candidate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="admin" 
            onClick={handleResetElection}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Election
          </Button>
        </div>

        {/* Candidates List */}
        <Card className="shadow-card bg-gradient-card border-0">
          <CardHeader>
            <CardTitle>Election Results & Management</CardTitle>
            <CardDescription>
              Current candidates and their vote counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No candidates have been added yet. Click "Add Candidate" to get started.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {sortedCandidates.map((candidate, index) => {
                  const candidateVotes = votes[candidate.id] || 0;
                  const percentage = getVotePercentage(candidate.id);

                  return (
                    <div key={candidate.id} className="p-4 border rounded-lg bg-background space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              #{index + 1}
                            </Badge>
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            <Badge variant="outline">{candidate.party}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{candidate.description}</p>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                              {candidateVotes} votes ({percentage}%)
                            </span>
                            <div className="flex-1 bg-muted rounded-full h-2 max-w-xs">
                              <div 
                                className="bg-accent h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveCandidate(candidate.id)}
                          className="ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};