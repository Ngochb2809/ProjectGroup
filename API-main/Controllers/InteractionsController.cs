using API.Data;
using API.Dtos;
using API.Models;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InteractionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;
        public InteractionsController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // POST: api/interactions/like
        [HttpPost("like")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<LikeDislikeCountDto>> Like([FromForm] int id, bool isContribution)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (isContribution)
            {
                var contribution = await _context.Contributions.FindAsync(id);
                if (contribution == null)
                {
                    return NotFound();
                }
                var existingLike = await _context.LikeDislikes.FirstOrDefaultAsync(l => l.ContributionId == id && l.UserId == currentUser.Id);
                if (existingLike == null)
                {
                    contribution.Likes++;
                    var likeDislike = new LikeDislike
                    {
                        ContributionId = id,
                        UserId = currentUser.Id,
                        Like = true,
                        Dislike = false
                    };
                    var notification = new Notification
                    {
                        UserID = contribution.UserID,
                        ContributionID = contribution.ContributionID,
                        NotificationType = NotificationType.Like,
                        Content = "Like",
                        Date = DateTime.Now
                    };
                    PostNotification(notification);
                    _context.LikeDislikes.Add(likeDislike);

                }
                else
                {
                    if (existingLike.Like)
                    {
                        _context.LikeDislikes.Remove(existingLike);
                        contribution.Likes--;
                    }
                    else if (existingLike.Dislike)
                    {
                        _context.LikeDislikes.Remove(existingLike);
                        contribution.Dislikes--;
                        contribution.Likes++;
                        var likeDislike = new LikeDislike
                        {
                            ContributionId = id,
                            UserId = currentUser.Id,
                            Like = true,
                            Dislike = false
                        };
                        var notification = new Notification
                        {
                            UserID = contribution.UserID,
                            ContributionID = contribution.ContributionID,
                            NotificationType = NotificationType.Like,
                            Content = "Like",
                            Date = DateTime.Now
                        };
                        PostNotification(notification);
                        _context.LikeDislikes.Add(likeDislike);
                    }

                }
                await _context.SaveChangesAsync();
                var likeDislikeCountDto = new LikeDislikeCountDto
                {
                    LikeCount = contribution.Likes,
                    DislikeCount = contribution.Dislikes
                };
                return likeDislikeCountDto;
            }
            else
            {
                var comment = await _context.Comments.FindAsync(id);
                if (comment == null)
                {
                    return NotFound();
                }
                var existingLike = await _context.LikeDislikeComment.FirstOrDefaultAsync(l => l.CommentId == id && l.UserId == currentUser.Id);
                if (existingLike == null)
                {
                    comment.Likes++;
                    var likeDislikeComment = new LikeDislikeComment
                    {
                        CommentId = id,
                        UserId = currentUser.Id,
                        Like = true,
                        Dislike = false
                    };
                    _context.LikeDislikeComment.Add(likeDislikeComment);

                }
                else
                {
                    if (existingLike.Like)
                    {
                        _context.LikeDislikeComment.Remove(existingLike);
                        comment.Likes--;
                    }
                    else if (existingLike.Dislike)
                    {
                        _context.LikeDislikeComment.Remove(existingLike);
                        comment.Dislikes--;
                        comment.Likes++;
                        var likeDislikeComment = new LikeDislikeComment
                        {
                            CommentId = id,
                            UserId = currentUser.Id,
                            Like = true,
                            Dislike = false
                        };
                        _context.LikeDislikeComment.Add(likeDislikeComment);
                    }

                }
                var likeDislikeCountDto = new LikeDislikeCountDto
                {
                    LikeCount = comment.Likes,
                    DislikeCount = comment.Dislikes
                };
                await _context.SaveChangesAsync();
                return likeDislikeCountDto;
            }
        }

        // POST: api/interactions/dislike
        [HttpPost("dislike")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<LikeDislikeCountDto>> Dislike([FromForm] int id, bool isContribution)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (isContribution)
            {
                var contribution = await _context.Contributions.FindAsync(id);
                if (contribution == null)
                {
                    return NotFound();
                }

                var existingLike = await _context.LikeDislikes.FirstOrDefaultAsync(l => l.ContributionId == id && l.UserId == currentUser.Id);
                if (existingLike == null)
                {
                    contribution.Dislikes++;
                    var likeDislike = new LikeDislike
                    {
                        ContributionId = id,
                        UserId = currentUser.Id,
                        Like = false,
                        Dislike = true
                    };
                    var notification = new Notification
                    {
                        UserID = contribution.UserID,
                        ContributionID = contribution.ContributionID,
                        NotificationType = NotificationType.DisLike,
                        Content = "DisLike",
                        Date = DateTime.Now
                    };
                    PostNotification(notification);
                    _context.LikeDislikes.Add(likeDislike);
                }
                else
                {
                    if (existingLike.Dislike)
                    {
                        _context.LikeDislikes.Remove(existingLike);
                        contribution.Dislikes--;
                    }
                    else if (existingLike.Like)
                    {
                        _context.LikeDislikes.Remove(existingLike);
                        contribution.Likes--;
                        contribution.Dislikes++;
                        var likeDislike = new LikeDislike
                        {
                            ContributionId = id,
                            UserId = currentUser.Id,
                            Like = false,
                            Dislike = true
                        };
                        var notification = new Notification
                        {
                            UserID = contribution.UserID,
                            ContributionID = contribution.ContributionID,
                            NotificationType = NotificationType.DisLike,
                            Content = "DisLike",
                            Date = DateTime.Now
                        };
                        PostNotification(notification);
                        _context.LikeDislikes.Add(likeDislike);


                    }


                }
                await _context.SaveChangesAsync();
                var likeDislikeCountDto = new LikeDislikeCountDto
                {
                    LikeCount = contribution.Likes,
                    DislikeCount = contribution.Dislikes
                };
                return likeDislikeCountDto;
            }
            else
            {
                var comment = await _context.Comments.FindAsync(id);
                if (comment == null)
                {
                    return NotFound();
                }

                var existingLike = await _context.LikeDislikeComment.FirstOrDefaultAsync(l => l.CommentId == id && l.UserId == currentUser.Id);
                if (existingLike == null)
                {
                    comment.Dislikes++;
                    var likeDislikeComment = new LikeDislikeComment
                    {
                        CommentId = id,
                        UserId = currentUser.Id,
                        Like = false,
                        Dislike = true
                    };
                    _context.LikeDislikeComment.Add(likeDislikeComment);
                }
                else
                {
                    if (existingLike.Dislike)
                    {
                        _context.LikeDislikeComment.Remove(existingLike);
                        comment.Dislikes--;
                    }
                    else if (existingLike.Like)
                    {
                        _context.LikeDislikeComment.Remove(existingLike);
                        comment.Likes--;
                        comment.Dislikes++;
                        var likeDislikeComment = new LikeDislikeComment
                        {
                            CommentId = id,
                            UserId = currentUser.Id,
                            Like = false,
                            Dislike = true
                        };
                        _context.LikeDislikeComment.Add(likeDislikeComment);


                    }


                }
                await _context.SaveChangesAsync();
                var likeDislikeCountDto = new LikeDislikeCountDto
                {
                    LikeCount = comment.Likes,
                    DislikeCount = comment.Dislikes
                };
                return likeDislikeCountDto;
            }
        }

        // POST: api/interactions/comment
        [HttpPost("comment")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<CommentDTO>> Comment([FromForm] CommentDTO commentDTO)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            var contribution = await _context.Contributions.FindAsync(commentDTO.ContributionId);
            if (contribution == null)
            {
                return NotFound();
            }

            var comment = new Comment
            {
                ContributionId = commentDTO.ContributionId,
                UserId = currentUser.Id,
                Content = commentDTO.Content,
                Date = DateTime.Now,
                IsAnonymous = commentDTO.IsAnonymous
                
            };
            var notification = new Notification
            {
                UserID = contribution.UserID,
                ContributionID = contribution.ContributionID,
                NotificationType = NotificationType.Comment,
                Content = "Comment",
                Date = DateTime.Now
            };
            PostNotification(notification);
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return commentDTO;
        }
        //PUT :POST: api/interactions/editcomment
        [HttpPut("editcomment/{id}")]
        public async Task<IActionResult> PutComment(int id, [FromForm] CommentDTO commentDTO)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            if (comment.UserId != currentUser.Id)
            {
                return Forbid();
            }

            // Update contribution properties
            comment.Date = DateTime.Now;
            comment.Content = commentDTO.Content;
            comment.IsAnonymous = commentDTO.IsAnonymous;
            try
            {
                _context.Entry(comment).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        private bool CommentExists(int id)
        {
            return _context.Comments.Any(e => e.Id == id);
        }
        // DELETE: api/interactions/delete/{id}
        [HttpDelete("deleteComment/{id}")]
       
        public async Task<IActionResult> DeleteComment(int id)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            if (comment.UserId != currentUser.Id)
            {
                return Forbid();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // POST: api/interactions/comment
        [HttpPost("comment/comment")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<CommentOfComment>> CommentOfComment([FromForm] CommentOfCommentDTO commentOfCommentDTO)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            var contribution = await _context.Contributions.FindAsync(commentOfCommentDTO.CommentId);
            if (contribution == null)
            {
                return NotFound();
            }

            var comment = new CommentOfComment
            {
                CommentId = commentOfCommentDTO.CommentId,
                UserId = currentUser.Id,
                Content = commentOfCommentDTO.Content,
                Date = DateTime.Now,
                IsAnonymous = commentOfCommentDTO.IsAnonymous

            };

            _context.CommentOfComments.Add(comment);
            await _context.SaveChangesAsync();

            return comment;
        }
        //PUT :POST: api/interactions/editcomment
        [HttpPut("comment/editcomment/{id}")]
        public async Task<ActionResult<CommentOfComment>> PutCommentOfComment(int id, [FromForm] CommentOfCommentDTO commentDTO)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }
            var comment = await _context.CommentOfComments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            if (comment.UserId != currentUser.Id)
            {
                return Forbid();
            }

            // Update contribution properties
            comment.Date = DateTime.Now;
            comment.Content = commentDTO.Content;
            comment.IsAnonymous = commentDTO.IsAnonymous;
            try
            {
                _context.Entry(comment).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentOfCommentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return comment;
        }
        private bool CommentOfCommentExists(int id)
        {
            return _context.CommentOfComments.Any(e => e.Id == id);
        }
        // DELETE: api/interactions/delete/{id}
        [HttpDelete("comment/deleteComment/{id}")]

        public async Task<IActionResult> DeleteCommentOfComment(int id)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            var comment = await _context.CommentOfComments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            if (comment.UserId != currentUser.Id)
            {
                return Forbid();
            }

            _context.CommentOfComments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/notifications
        [HttpGet("notifications")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetNotifications()
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            var notifications = await _context.Notifications
                .Where(n => n.UserID == currentUser.Id)
                .Select(n => new NotificationDTO
                {
                    NotificationID = n.NotificationID,
                    UserID = n.UserID,
                    NotificationType = n.NotificationType,
                    Content = n.Content,
                    Date = n.Date
                })
                .ToListAsync();

            return notifications;
        }

        private void PostNotification(Notification notification)
        {
            //var notification = new Notification
            //{
            //    UserID = notificationDTO.UserID,
            //    ContributionID = notificationDTO.ContributionID,
            //    NotificationType = notificationDTO.NotificationType,
            //    Content = notificationDTO.Content,
            //    Date = DateTime.Now
            //};
            _context.Notifications.Add(notification);
        }
    }

   
    public class LikeDislikeCountDto
    {
        public int LikeCount { get; set; }
        public int DislikeCount { get; set; }
    }
}
