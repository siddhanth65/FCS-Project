import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GroupMessagingPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    
    // Mock group conversations
    setConversations([
      {
        id: 1,
        name: "Engineering Team",
        type: "group",
        members: ["John Doe", "Jane Smith", "Mike Johnson", "You"],
        lastMessage: "Great work on the project!",
        lastMessageTime: "2:30 PM",
        unreadCount: 2
      },
      {
        id: 2,
        name: "Product Discussion",
        type: "group", 
        members: ["Sarah Wilson", "Tom Brown", "You"],
        lastMessage: "Let's review the requirements",
        lastMessageTime: "1:15 PM",
        unreadCount: 0
      },
      {
        id: 3,
        name: "Jane Smith",
        type: "direct",
        members: ["Jane Smith", "You"],
        lastMessage: "Thanks for your help!",
        lastMessageTime: "Yesterday",
        unreadCount: 0
      }
    ]);
    
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages for selected conversation
      setMessages([
        {
          id: 1,
          sender: "John Doe",
          content: "Hey team, how's the project going?",
          timestamp: "2:00 PM",
          isMe: false
        },
        {
          id: 2,
          sender: "You",
          content: "Going well! Almost finished with the frontend.",
          timestamp: "2:15 PM",
          isMe: true
        },
        {
          id: 3,
          sender: "Jane Smith",
          content: "Great work on the project!",
          timestamp: "2:30 PM",
          isMe: false
        }
      ]);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Update conversation's last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: newMsg.timestamp }
          : conv
      ));
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      const newGroup = {
        id: conversations.length + 1,
        name: groupName,
        type: "group",
        members: [...selectedUsers, "You"],
        lastMessage: "Group created",
        lastMessageTime: "Just now",
        unreadCount: 0
      };
      
      setConversations([...conversations, newGroup]);
      setGroupName("");
      setSelectedUsers([]);
      setShowNewGroupModal(false);
    }
  };

  const availableUsers = [
    "John Doe", "Jane Smith", "Mike Johnson", 
    "Sarah Wilson", "Tom Brown", "Emma Davis"
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                New Group
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg h-[600px] flex">
          {/* Conversations List */}
          <div className="w-80 border-r border-slate-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Conversations</h2>
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conv.id
                        ? "bg-indigo-50 border-l-4 border-indigo-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{conv.name}</h3>
                        <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-slate-400">{conv.lastMessageTime}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900">{selectedConversation.name}</h3>
                  <p className="text-sm text-slate-500">
                    {selectedConversation.type === "group" 
                      ? `${selectedConversation.members.length} members`
                      : "Direct message"
                    }
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isMe
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        {!message.isMe && (
                          <p className="text-xs font-medium mb-1 opacity-75">{message.sender}</p>
                        )}
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isMe ? "text-indigo-200" : "text-slate-500"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Select a conversation</h3>
                  <p className="text-slate-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Create New Group</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter group name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Add Members</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableUsers.map((user) => (
                  <label key={user} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(u => u !== user));
                        }
                      }}
                      className="mr-2"
                    />
                    {user}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupMessagingPage;
