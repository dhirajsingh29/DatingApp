namespace DatingApp.API.Dtos
{
    public class CreateMessageDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public System.DateTime MessageSent { get; set; }
        public string Content { get; set; }

        public CreateMessageDto()
        {
            MessageSent = System.DateTime.Now;
        }
    }
}