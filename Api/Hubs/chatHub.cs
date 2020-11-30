using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Hubs
{
    public class chatHub : Hub
    {
        private static List<string> connectionIds = new List<string>();

        public async Task SendMessage(string name, string message) => await this.Clients.All.SendAsync("ReceiveMessage", name, message);

        public async Task SendSticker(string stickergroup, string stickername, string name) => await this.Clients.All.SendAsync("ReceiveSticker", stickergroup, stickername, name);

        public async Task SnedReplyMessage(string name,string message,string authorReplyMessage,string replyMessage)
        {
            await this.Clients.All.SendAsync("ReceiveReplyMessage", name, message, authorReplyMessage, replyMessage);
        }

        public async Task SnedReplySticker(
          string stickergroup,
          string stickername,
          string name,
          string authorReplyMessage,
          string replyMessage)
        {
            await this.Clients.All.SendAsync("ReceiveReplySticker", stickergroup, stickername, name, authorReplyMessage, replyMessage);
        }

        public async Task SnedReplyMessageToSticker(string stickerUri,string name,string message,string authorReplyMessage)
        {
            await this.Clients.All.SendAsync("ReceiveReplyMessageToSticker", stickerUri, name, message, authorReplyMessage);
        }

        public async Task SendMessage_pv(string connectionId, string name, string message)
        {
            await Clients.Clients(connectionId, Context.ConnectionId).SendAsync("ReceiveMessage", name, message);
        }

        public async Task SnedReplyMessage_pv(string connectionId,string name,string message,string authorReplyMessage,string replyMessage)
        {
            await Clients.Clients(connectionId,Context.ConnectionId).SendAsync("ReceiveReplyMessage", name, message, authorReplyMessage, replyMessage);
        }

        public async Task SnedReplyMessageToSticker_pv(string connectionId,string stickerUri,string name,string message,string authorReplyMessage,string replyMessage)
        {
            
            await Clients.Clients(Context.ConnectionId, connectionId).SendAsync("ReceiveReplyMessageToSticker", stickerUri, name, message, authorReplyMessage, replyMessage);
        }

        public override Task OnConnectedAsync()
        {
            connectionIds.Add(this.Context.ConnectionId);
            this.Clients.All.SendAsync("UserConnected", connectionIds.ToArray());
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            connectionIds.Remove(this.Context.ConnectionId);
            this.Clients.All.SendAsync("UserDisconnected", connectionIds.ToArray());
            return base.OnDisconnectedAsync(exception);
        }
    }
}
