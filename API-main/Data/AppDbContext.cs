using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) :base(options)
        {
            
        }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Contribution> Contributions { get; set; }
        public DbSet<ContributionStatistics> ContributionStatistics { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<StatisticsReport> StatisticsReports { get; set; }
        public DbSet<UploadedDocument> UploadedDocuments { get; set; }
        public DbSet<LikeDislike> LikeDislikes { get; set; }
        public DbSet<LikeDislikeComment> LikeDislikeComment {  get; set; }
        public DbSet<CommentOfComment> CommentOfComments { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<CommentOfComment>()
               .HasOne(c => c.Comment)
               .WithMany(c => c.CommentOfComments)
               .HasForeignKey(c => c.CommentId )
               .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<LikeDislikeComment>()
               .HasOne(c => c.Comment)
               .WithMany(c => c.LikeDislikeComments)
               .HasForeignKey(c => c.CommentId)
               .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<LikeDislike>()
                .HasOne(c => c.Contribution)
                .WithMany(c => c.LikeDislikes)
                .HasForeignKey(c => c.ContributionId)
                .OnDelete(DeleteBehavior.Cascade); // Xóa tất cả các bình luận liên quan khi bài báo bị xóa
            modelBuilder.Entity<Contribution>()
                .HasOne(c => c.User)
                .WithMany(u => u.Contributions)
                .HasForeignKey(c => c.UserID)
                .OnDelete(DeleteBehavior.Restrict); // Nếu muốn xóa tài khoản User thì không xóa các Contributions liên quan

            modelBuilder.Entity<Contribution>()
                .HasOne(c => c.Faculty)
                .WithMany(f => f.Contributions)
                .HasForeignKey(c => c.FacultyID)
                .OnDelete(DeleteBehavior.Restrict); // Nếu muốn xóa khoa thì không xóa các Contributions liên quan
            modelBuilder.Entity<Contribution>()
               .HasOne(c => c.Event)
               .WithMany(f => f.Contributions)
               .HasForeignKey(c => c.EventID)
               .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Contribution)
                .WithMany(c => c.Comments)
                .HasForeignKey(c => c.ContributionId)
                .OnDelete(DeleteBehavior.Cascade); // Xóa tất cả các bình luận liên quan khi bài báo bị xóa

            modelBuilder.Entity<UploadedDocument>()
                .HasOne(d => d.Contribution)
                .WithMany(c => c.Documents)
                .HasForeignKey(d => d.ContributionId)
                .OnDelete(DeleteBehavior.Cascade); // Xóa tất cả các tài liệu liên quan khi bài báo bị xóa

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserID)
                .OnDelete(DeleteBehavior.Cascade); // Xóa tất cả các thông báo liên quan khi người dùng bị xóa
            modelBuilder.Entity<Event>()
               .HasOne(e => e.Faculty)
               .WithMany(f => f.Events)
               .HasForeignKey(e => e.FacultyID)
               .OnDelete(DeleteBehavior.Cascade);
        }
    }
}