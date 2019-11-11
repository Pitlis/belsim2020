using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
    [Table("RK_Accounts")]
    public class RkAccount
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RkAccountId { get; set; }

        public string Name { get; set; }
    }
}
