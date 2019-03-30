using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DataAccessLayer.Dating;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(UserActivityLogger))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository _repository, IMapper _mapper)
        {
            this._mapper = _mapper;
            this._repository = _repository;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repository.GetMessage(id);
            if (message == null)
                return NotFound();
            return Ok(message);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages(int userId, [FromQuery]MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            messageParams.UserId = userId;
            
            var messages = await _repository.GetMessages(messageParams);

            var messagesToReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messages);

            Response.Pagination(messages.CurrentPage, messages.PageSize,
                messages.TotalCount, messages.TotalPages);

            return Ok(messagesToReturn);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var messages = await _repository.GetMessagesThread(userId, recipientId);

            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messages);

            return Ok(messageThread);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, CreateMessageDto createMessageDto)
        {
            var sender = await _repository.GetUser(userId);

            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            createMessageDto.SenderId = userId;

            var recipient = await _repository.GetUser(createMessageDto.RecipientId);
            if (recipient == null)
                return BadRequest("Could not find the user!!");

            var message = _mapper.Map<Message>(createMessageDto);

            _repository.Add(message);

            // if (await _repository.SaveAll())
            //     return CreatedAtRoute("GetMessage", new { id = message.Id }, message);

            // at this stage, the CreatedAtRoute will return everything related to Sender and Recipient
            // including PasswordHash and PasswordSalt. In order to avoid that, 
            // we will reverseMap the message into createMessageDto.

            // var messageToCreate = _mapper.Map<CreateMessageDto>(message);

            if (await _repository.SaveAll())
            {
                var messageToCreate = _mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetMessage", new { id = message.Id }, messageToCreate);
            }                
            
            throw new Exception("Creating the message failed on save!!");
        }

        // though we are deleting the pic but not hard delete unless both sender and recipient
        // has deleted the message; hence HttpPost and not HttpDelete
        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var message = await _repository.GetMessage(id);

            if (message.SenderId == userId)
                message.DeletedBySender = true;
            
            if (message.RecipientId == userId)
                message.DeletedByRecipient = true;

            if (message.DeletedBySender && message.DeletedByRecipient)
                _repository.Delete(message);
            
            if (await _repository.SaveAll())
                return NoContent();

            throw new Exception("Error deleting the message!!");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repository.GetMessage(id);

            if (message.RecipientId != userId)
                return Unauthorized();
            
            message.IsRead = true;
            message.DateRead = DateTime.Now;

            await _repository.SaveAll();
            return NoContent();
        }
    }
}