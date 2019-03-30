namespace DatingApp.API.Dtos
{
    public class MessageToReturnDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderNickname { get; set; }
        public string SenderPicUrl { get; set; }
        public int RecipientId { get; set; }
        public string RecipientNickname { get; set; }
        public string RecipientPicUrl { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public System.DateTime? DateRead { get; set; }
        public System.DateTime MessageSent { get; set; }
    }
}